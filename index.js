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

program
    .command("lihat")
    .description("Lihat semua pengeluaran")
    .action(() => {
        const data = loadData();
        if (data.length === 0) {
            console.log("📭 Belum ada data pengeluaran.");
            return;
        }

        console.log("+----+----------------------+----------+");
        console.log("| ID | Deskripsi            | Nominal  |");
        console.log("+----+----------------------+----------+");

        data.forEach((item) => {
            console.log(
                `| ${item.id.toString().slice(-4).padEnd(4)} | ${item.deskripsi.padEnd(20)} | Rp ${item.nominal
                    .toString()
                    .padStart(7)} |`
            );
        });

        console.log("+----+----------------------+----------+");
    });


program.parse(process.argv);
