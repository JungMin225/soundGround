// routes/tasteRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const {
  showTasteForm,
  addTrackFromTaste,
} = require("../controllers/playlistController");

// 🔹 업로드 경로 & 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // /routes 기준이니까 한 단계 위로 올라가서 /uploads
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);                 // .mp3
    const base = path.basename(file.originalname, ext);          // 파일명
    cb(null, `${base}-${Date.now()}${ext}`);                     // mySong-123123123.mp3
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB 제한(원하면 조정)
});

// GET /taste
router.get("/", showTasteForm);

// POST /taste (음원 파일 1개 + 나머지 텍스트)
router.post("/", upload.single("audio"), addTrackFromTaste);

module.exports = router;
