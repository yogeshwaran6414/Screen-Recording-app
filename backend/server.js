require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const { initDb, insertRecording, getRecordings, getRecordingById } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Auto-create uploads folder if missing
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const fname = Date.now() + '-' + (file.originalname || "recording.webm");
    cb(null, fname);
  }
});
const upload = multer({ storage });

initDb();

// Upload recording endpoint
app.post('/api/recordings', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const { title } = req.body;
    await insertRecording({
      filename: req.file.filename,
      size: req.file.size,
      title: title || req.file.originalname,
      createdAt: Date.now()
    });
    res.json({ message: "Uploaded successfully!" });
  } catch (e) {
    res.status(500).json({ message: "DB error: " + e.message });
  }
});

// Get list endpoint
app.get('/api/recordings', async (_, res) => {
  try {
    const recs = await getRecordings();
    res.json(recs);
  } catch (e) {
    res.status(500).json({ message: "DB error: " + e.message });
  }
});

// Streaming/download endpoint
app.get('/api/recordings/:id', async (req, res) => {
  try {
    const rec = await getRecordingById(req.params.id);
    if (!rec) return res.status(404).send("Not found");
    res.sendFile(path.join(uploadDir, rec.filename));
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});

// Delete recording endpoint
app.delete('/api/recordings/:id', async (req, res) => {
  try {
    const rec = await getRecordingById(req.params.id);
    if (!rec) return res.status(404).json({ message: "Recording not found" });

    // Delete file
    const filePath = path.join(uploadDir, rec.filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error("File deletion error:", err);
    });

    // Delete DB entry
    const db = new sqlite3.Database('db.sqlite');
    db.run('DELETE FROM recordings WHERE id = ?', [req.params.id], function(err) {
      db.close();
      if (err) return res.status(500).json({ message: "DB delete error: " + err.message });
      res.json({ message: "Recording deleted successfully" });
    });
  } catch (e) {
    res.status(500).json({ message: "Error: " + e.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
