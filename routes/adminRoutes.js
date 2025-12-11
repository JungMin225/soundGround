// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../middlewares/auth");
const {
  adminDashboard,
  adminFindList,
  adminDeleteFind,
  adminLyricList,
  adminDeleteLyric,
  adminChainList,
  adminDeleteChain,
} = require("../controllers/adminController");

// 🔹 모든 /admin 하위는 관리자만
router.use(requireAdmin);

// 간단한 관리자 홈 (요약 + 링크)
router.get("/", adminDashboard);

// Find Ground 글 관리
router.get("/find", adminFindList);
router.delete("/find/:id", adminDeleteFind);

// Lyric Ground 글 관리
router.get("/lyric", adminLyricList);
router.delete("/lyric/:id", adminDeleteLyric);

// Chain Ground 글 관리
router.get("/chain", adminChainList);
router.delete("/chain/:id", adminDeleteChain);

module.exports = router;
