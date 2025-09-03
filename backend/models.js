const sqlite3 = require('sqlite3').verbose();

const DB_FILE = 'db.sqlite';

function initDb() {
  const db = new sqlite3.Database(DB_FILE);
  db.run(`CREATE TABLE IF NOT EXISTS recordings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    title TEXT NOT NULL,
    size INTEGER NOT NULL,
    createdAt INTEGER NOT NULL
  )`);
  db.close();
}

function insertRecording(data) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_FILE);
    db.run(`INSERT INTO recordings (filename, title, size, createdAt) VALUES (?, ?, ?, ?)`,
      [data.filename, data.title, data.size, data.createdAt],
      function (err) {
        db.close();
        if (err) reject(err);
        else resolve(this.lastID);
      });
  });
}

function getRecordings() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_FILE);
    db.all(`SELECT id, filename, title, size, createdAt FROM recordings ORDER BY createdAt DESC`, [], (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getRecordingById(id) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_FILE);
    db.get(`SELECT * FROM recordings WHERE id = ?`, [id], (err, row) => {
      db.close();
      if (err) reject(err);
      else resolve(row);
    });
  });
}

module.exports = { initDb, insertRecording, getRecordings, getRecordingById };
