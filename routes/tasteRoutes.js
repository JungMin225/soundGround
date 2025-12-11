// routes/tasteRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const {
  showTasteForm,
  addTrackFromTaste,
} = require("../controllers/playlistController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// GET /taste
router.get("/", showTasteForm);

// POST /taste
router.post("/", upload.single("audio"), addTrackFromTaste);

module.exports = router;
