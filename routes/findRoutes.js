// routes/findRoutes.js
const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const {
  showFind,
  showNewFind,
  createFind,
  showFindDetail,
  createFindComment,
} = require("../controllers/findController");

// ===== multer 설정 (Find Ground 음원 업로드용) =====
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/find"));
  },
  filename(req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const fileFilter = (req, file, cb) => {
  // 기본적으로 오디오 파일만 허용 (audio/*)
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB 정도 제한
  },
});

// ===== 라우트 =====

// 목록
router.get("/", showFind);

// 새 글 작성 폼
router.get("/new", showNewFind);

// 새 글 생성
router.post("/", upload.single("audio"), createFind);

// 댓글 작성 (게시글 ID 기준)
router.post("/:id/comments", createFindComment);

// 게시글 상세
router.get("/:id", showFindDetail);

module.exports = router;
