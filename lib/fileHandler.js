const fs = require("fs");
const path = "./data/expenses.json";

function loadData() {
  if (!fs.existsSync(path)) return [];
  return JSON.parse(fs.readFileSync(path));
}

function saveData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = { loadData, saveData };
