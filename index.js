#!/usr/bin/env node

const { program } = require('commander');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { 
  readJSON, 
  writeJSON, 
  addItem, 
  updateItem, 
  deleteItem 
} = require('./utils/fileHandler');

// Lokasi file
const EXPENSES_FILE = 'expenses.json';
const BUDGET_FILE = 'budget.json';

// Format tanggal ISO
const getToday = () => new Date().toISOString().slice(0, 10);

// 👉 Command: tambah
program
  .command('tambah')
  .description('Tambah pengeluaran')
  .requiredOption('--deskripsi <deskripsi>', 'Deskripsi pengeluaran')
  .requiredOption('--nominal <nominal>', 'Nominal pengeluaran')
  .option('--kategori <kategori>', 'Kategori pengeluaran')
  .action((options) => {
    const { deskripsi, nominal, kategori } = options;

    if (!deskripsi.trim()) {
      console.log('❌ Deskripsi tidak boleh kosong.');
      return;
    }

    const jumlah = parseInt(nominal);
    if (isNaN(jumlah) || jumlah <= 0) {
      console.log('❌ Nominal harus angka positif.');
      return;
    }

    const dataBaru = {
      id: uuidv4(),
      deskripsi,
      nominal: jumlah,
      kategori: kategori || 'lainnya',
      tanggal: getToday()
    };

    addItem(EXPENSES_FILE, dataBaru);
    console.log('✅ Pengeluaran berhasil ditambahkan!');
  });

// 👉 Command: list
program
  .command('list')
  .description('Lihat semua pengeluaran')
  .option('--kategori <kategori>', 'Filter berdasarkan kategori')
  .action((options) => {
    const data = readJSON(EXPENSES_FILE);
    const list = options.kategori
      ? data.filter(item => item.kategori === options.kategori)
      : data;

    if (list.length === 0) {
      console.log('📭 Tidak ada data pengeluaran.');
      return;
    }

    console.table(list, ['id', 'tanggal', 'deskripsi', 'kategori', 'nominal']);
  });

// 👉 Command: update
program
  .command('update')
  .description('Update pengeluaran berdasarkan ID')
  .requiredOption('--id <id>', 'ID data yang mau diubah')
  .option('--deskripsi <deskripsi>', 'Deskripsi baru')
  .option('--nominal <nominal>', 'Nominal baru')
  .option('--kategori <kategori>', 'Kategori baru')
  .action((options) => {
    const { id, deskripsi, nominal, kategori } = options;
    const dataBaru = {};
    if (deskripsi) dataBaru.deskripsi = deskripsi;
    if (nominal) dataBaru.nominal = parseInt(nominal);
    if (kategori) dataBaru.kategori = kategori;

    const berhasil = updateItem(EXPENSES_FILE, id, dataBaru);
    if (berhasil) {
      console.log('✅ Data berhasil diupdate.');
    } else {
      console.log('❌ ID tidak ditemukan.');
    }
  });

// 👉 Command: hapus
program
  .command('hapus')
  .description('Hapus pengeluaran berdasarkan ID')
  .requiredOption('--id <id>', 'ID data yang mau dihapus')
  .action((options) => {
    const berhasil = deleteItem(EXPENSES_FILE, options.id);
    if (berhasil) {
      console.log('🗑️ Data berhasil dihapus.');
    } else {
      console.log('❌ ID tidak ditemukan.');
    }
  });

// 👉 Command: total
program
  .command('total')
  .description('Hitung total semua pengeluaran')
  .action(() => {
    const data = readJSON(EXPENSES_FILE);
    const total = data.reduce((sum, item) => sum + item.nominal, 0);
    console.log(`💰 Total semua pengeluaran: Rp${total.toLocaleString()}`);
  });

// 👉 Command: total-bulan
program
  .command('total-bulan')
  .description('Hitung total pengeluaran per bulan')
  .requiredOption('--bulan <yyyy-mm>', 'Contoh: 2025-06')
  .action((options) => {
    const data = readJSON(EXPENSES_FILE);
    const list = data.filter(item => item.tanggal.startsWith(options.bulan));
    const total = list.reduce((sum, item) => sum + item.nominal, 0);
    console.log(`📅 Total pengeluaran bulan ${options.bulan}: Rp${total.toLocaleString()}`);
  });

// 👉 Command: set-budget
program
  .command('set-budget')
  .description('Set budget bulanan (Rp)')
  .requiredOption('--bulan <yyyy-mm>', 'Contoh: 2025-06')
  .requiredOption('--jumlah <angka>', 'Contoh: 2000000')
  .action((options) => {
    const { bulan, jumlah } = options;
    const budget = readJSON(BUDGET_FILE);
    const index = budget.findIndex(b => b.bulan === bulan);

    if (index !== -1) {
      budget[index].jumlah = parseInt(jumlah);
    } else {
      budget.push({ bulan, jumlah: parseInt(jumlah) });
    }

    writeJSON(BUDGET_FILE, budget);
    console.log(`✅ Budget bulan ${bulan} diset: Rp${parseInt(jumlah).toLocaleString()}`);
  });

// 👉 Command: cek-budget
program
  .command('cek-budget')
  .description('Cek pengeluaran vs budget bulan tertentu')
  .requiredOption('--bulan <yyyy-mm>', 'Contoh: 2025-06')
  .action((options) => {
    const { bulan } = options;
    const data = readJSON(EXPENSES_FILE).filter(item => item.tanggal.startsWith(bulan));
    const total = data.reduce((sum, item) => sum + item.nominal, 0);

    const budget = readJSON(BUDGET_FILE).find(b => b.bulan === bulan);
    if (!budget) {
      console.log(`⚠️ Budget untuk bulan ${bulan} belum diset.`);
      return;
    }

    console.log(`📊 Budget: Rp${budget.jumlah.toLocaleString()}`);
    console.log(`💸 Pengeluaran: Rp${total.toLocaleString()}`);
    if (total > budget.jumlah) {
      console.log('🚨 WARNING: Pengeluaran melebihi budget!');
    } else {
      console.log('✅ Masih dalam batas budget.');
    }
  });

// 👉 Command: export-csv
program
  .command('export-csv')
  .description('Export data pengeluaran ke file expenses.csv')
  .action(() => {
    const data = readJSON(EXPENSES_FILE);
    if (data.length === 0) {
      console.log('📭 Tidak ada data untuk diexport.');
      return;
    }

    const header = 'ID,Tanggal,Deskripsi,Kategori,Nominal';
    const rows = data.map(item =>
      `${item.id},${item.tanggal},"${item.deskripsi}",${item.kategori},${item.nominal}`
    );
    const csvContent = [header, ...rows].join('\n');

    fs.writeFileSync(path.join(__dirname, 'expenses.csv'), csvContent);
    console.log('✅ Data berhasil diexport ke expenses.csv');
  });

program.parse(process.argv);
