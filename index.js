#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");
const filePath = "expenses.json";

// Baca data dari file
function loadData() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
}

// Simpan data ke file
function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Tambah pengeluaran
program
  .command("tambah")
  .description("Tambah pengeluaran baru")
  .requiredOption("--deskripsi <deskripsi>")
  .requiredOption("--nominal <nominal>")
  .action((opts) => {
    const { deskripsi, nominal } = opts;
    if (!deskripsi.trim()) return console.log("❌ Deskripsi tidak boleh kosong!");
    if (nominal <= 0) return console.log("❌ Nominal harus lebih dari 0!");

    const data = loadData();
    const newItem = {
      id: Date.now(),
      deskripsi,
      nominal: Number(nominal),
    };
    data.push(newItem);
    saveData(data);
    console.log("✅ Pengeluaran berhasil ditambahkan!");
  });

program.parse(process.argv);
