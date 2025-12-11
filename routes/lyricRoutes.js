// routes/lyricRoutes.js
const express = require("express");
const router = express.Router();

const {
  showLyricList,
  showNewLyric,
  createLyric,
  showLyricDetail,
} = require("../controllers/lyricController");

const { requireLogin } = require("../middlewares/auth");

router.use(requireLogin);

// 목록
router.get("/", showLyricList);

// 새 글 작성 폼
router.get("/new", showNewLyric);

// 저장
router.post("/", createLyric);

// 상세 페이지
router.get("/:id", showLyricDetail);

module.exports = router;
