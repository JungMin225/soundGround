// controllers/findController.js
const asyncHandler = require("express-async-handler");
const Find = require("../models/find");
const FindComment = require("../models/findComment");

const PAGE_SIZE = 7; // 기존 그대로

// GET /find : Find Ground 목록 페이지
exports.showFind = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = PAGE_SIZE;
  const skip = (page - 1) * limit;

  const [totalCount, docs] = await Promise.all([
    Find.countDocuments({}),
    Find.find({})
      .sort({ createdAt: -1 }) // 최신 글이 위로
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const posts = docs.map((doc) => {
    const date = doc.createdAt ? new Date(doc.createdAt) : null;
    let formattedDate = "";

    if (date && !Number.isNaN(date.getTime())) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      formattedDate = `${y}.${m}.${d}`;
    }

    return { ...doc, formattedDate };
  });

  res.render("find", {
    user: req.session.user || null,
    posts,
    currentPage: page,
    totalPages,
  });
});


// GET /find/new : 새 글 작성 폼
exports.showNewFind = asyncHandler(async (req, res) => {
  if (!req.session || !req.session.user) {
    // 체인에서 쓰던 로그인 팝업 재사용
    return res.render("need_login");
  }

  res.render("find_new", {
    user: req.session.user,
  });
});


// POST /find : 새 글 생성 + 파일 업로드
exports.createFind = asyncHandler(async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.render("need_login");
  }

  const { title, body } = req.body;

  if (!title || !body) {
    // 간단한 검증
    return res.status(400).send("제목과 내용을 모두 입력해 주세요.");
  }

  let filePath;
  let fileOriginalName;

  if (req.file) {
    // multer가 저장한 파일 정보
    filePath = `/uploads/find/${req.file.filename}`; // 나중에 <audio src>로 사용
    fileOriginalName = req.file.originalname;
  }

  await Find.create({
    user: req.session.user.id,
    title,
    body,
    filePath,
    fileOriginalName,
  });

  // 작성 후 목록 첫 페이지로 이동
  return res.redirect("/find");
});

// GET /find/:id  : 게시글 상세 페이지
exports.showFindDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doc = await Find.findById(id).lean();
  if (!doc) {
    return res.status(404).send("해당 게시글을 찾을 수 없습니다.");
  }

  // 날짜 포맷
  const date = doc.createdAt ? new Date(doc.createdAt) : null;
  let formattedDate = "";
  if (date && !Number.isNaN(date.getTime())) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    formattedDate = `${y}.${m}.${d}`;
  }

  const bodyLines = (doc.body || "").split(/\r?\n/);

  // 댓글 목록 (작성 순서대로)
  const rawComments = await FindComment.find({ post: id })
    .sort({ createdAt: 1 })
    .populate("user", "username") // User 스키마의 username 필드 사용
    .lean();

  const comments = rawComments.map((c) => ({
    ...c,
    authorName: c.user ? c.user.username : "알 수 없음",
  }));

  res.render("find_detail", {
    user: req.session.user || null,
    post: doc,
    formattedDate,
    bodyLines,
    comments,
  });
});

// POST /find/:id/comments : 댓글 작성
exports.createFindComment = asyncHandler(async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.render("need_login");
  }

  const { id } = req.params; // 게시글 id
  const { content } = req.body;

  if (!content || !content.trim()) {
    // 내용 없이 보내면 그냥 다시 상세로
    return res.redirect(`/find/${id}`);
  }

  await FindComment.create({
    post: id,
    user: req.session.user.id,
    content: content.trim(),
  });

  return res.redirect(`/find/${id}#comments`);
});
