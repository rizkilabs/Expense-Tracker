// utils/fileHandler.js

const fs = require('fs');
const path = require('path');

// Ambil path absolut file JSON
const getFilePath = (filename) => path.join(__dirname, '..', 'data', filename);

// Baca data dari file JSON
function readJSON(filename) {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) return [];

  const rawData = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(rawData);
  } catch (error) {
    console.error('❌ Gagal parse JSON:', error.message);
    return [];
  }
}

// Tulis data ke file JSON
function writeJSON(filename, data) {
  const filePath = getFilePath(filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Gagal menulis file:', error.message);
  }
}

// Tambahkan 1 item ke file JSON
function addItem(filename, newItem) {
  const data = readJSON(filename);
  data.push(newItem);
  writeJSON(filename, data);
}

// Update item berdasarkan ID
function updateItem(filename, id, updatedFields) {
  const data = readJSON(filename);
  const index = data.findIndex((item) => item.id === id);
  if (index === -1) return false;

  data[index] = { ...data[index], ...updatedFields };
  writeJSON(filename, data);
  return true;
}

// Hapus item berdasarkan ID
function deleteItem(filename, id) {
  const data = readJSON(filename);
  const newData = data.filter((item) => item.id !== id);
  if (newData.length === data.length) return false;

  writeJSON(filename, newData);
  return true;
}

module.exports = {
  readJSON,
  writeJSON,
  addItem,
  updateItem,
  deleteItem,
};
