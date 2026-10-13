const fs = require("fs");
const path = require("path");

function filePath(name) {
  return path.join(__dirname, "..", "data", name + ".json");
}

function readData(name) {
  try {
    const text = fs.readFileSync(filePath(name), "utf8");
    return JSON.parse(text) || [];
  } catch {
    return [];
  }
}

function writeData(name, data) {
  fs.mkdirSync(path.dirname(filePath(name)), { recursive: true });
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };