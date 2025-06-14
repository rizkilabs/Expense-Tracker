# 💸 Expense Tracker CLI

A simple and lightweight command-line app to help you track your daily expenses — right from your terminal. No fancy UI, no database, just your terminal and a JSON file. Perfect for learning how to build backend logic using Node.js!

---

## ✨ Features

- ✅ Add a new expense
- 📋 List all expenses
- 📝 Update or delete an expense by ID
- 📆 Filter expenses by category or month
- 💰 View total expenses (all-time or per month)
- 📊 Set and check monthly budget
- 📦 Export expenses to CSV

---

## 🛠️ Tech Stack

- Node.js
- Commander.js (for CLI commands)
- UUID (for unique IDs)
- JSON file as simple database (no setup needed)

---

## 🚀 Getting Started

### 1. Clone this repo

```bash
git clone https://github.com/rizkilabs/Expense-Tracker.git
cd Expense-Tracker
````

### 2. Install dependencies

```bash
npm install
```

### 3. Run the CLI

Make sure to give execute permission (if needed):

```bash
chmod +x index.js
```

Then you can run it using:

```bash
node index.js [command]
```

Or if you add it globally (optional):

```bash
npm link
expense-tracker [command]
```

---

## 🧪 Usage Examples

### ✅ Add an expense

```bash
node index.js tambah --deskripsi "Coffee" --nominal 15000 --kategori makan
```

### 📋 List all expenses

```bash
node index.js list
```

### 📂 Filter by category

```bash
node index.js list --kategori transport
```

### 📝 Update an expense

```bash
node index.js update --id <expense-id> --nominal 25000
```

### 🗑️ Delete an expense

```bash
node index.js hapus --id <expense-id>
```

### 💰 Total expenses

```bash
node index.js total
```

### 📅 Total by month

```bash
node index.js total-bulan --bulan 2025-06
```

### 🎯 Set monthly budget

```bash
node index.js set-budget --bulan 2025-06 --jumlah 2000000
```

### 🚨 Check budget

```bash
node index.js cek-budget --bulan 2025-06
```

### 📤 Export to CSV

```bash
node index.js export-csv
```

---

## 📁 File Structure

```
Expense-Tracker/
├── index.js                 # main CLI logic
├── utils/
│   └── fileHandler.js       # helper functions for JSON read/write
├── data/
│   ├── expenses.json        # your "database" for expenses
│   └── budget.json          # stores monthly budgets
├── expenses.csv             # optional CSV export
├── package.json
└── README.md
```

---

## 📌 Notes

* Dates are stored in ISO format: `YYYY-MM-DD`
* Make sure `expenses.json` and `budget.json` exist in the `/data` folder
* All amounts are assumed to be in IDR (Rupiah) 💵

---

## 📸 Sample Output

```bash
$ node index.js list

┌────────────┬────────────┬────────────┬────────────┬────────────┐
│    ID      │   Tanggal  │  Deskripsi │  Kategori  │  Nominal   │
├────────────┼────────────┼────────────┼────────────┼────────────┤
│ 1234abcd   │ 2025-06-14 │ Coffee     │ makan      │ 15000      │
└────────────┴────────────┴────────────┴────────────┴────────────┘
```

---

## 📦 Version

```
v1.0.0
```

---

## 🙌 Credits

Made with 💙 by [M. Rizki](https://github.com/rizkilabs)

---

## 🔖 License

MIT — free to use, modify, and share!

https://roadmap.sh/projects/expense-tracker
