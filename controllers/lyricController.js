// controllers/lyricController.js
const asyncHandler = require("express-async-handler");
const Lyric = require("../models/lyric");

const PAGE_SIZE = 5; // 한 페이지에 보여줄 일기 개수

// GET /lyric : 목록 + 페이지네이션
exports.showLyricList = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = PAGE_SIZE;
  const skip = (page - 1) * limit;

  const userId = req.session.user.id;

  const [totalCount, docs] = await Promise.all([
    Lyric.countDocuments({ user: userId }),
    Lyric.find({ user: userId })
      .sort({ createdAt: -1 }) // 최신 글이 가장 앞
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const lyrics = docs.map((doc, idx) => {
    const date = doc.createdAt ? new Date(doc.createdAt) : null;
    let formattedDate = "";
    if (date && !Number.isNaN(date.getTime())) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      formattedDate = `${y}.${m}.${d}`;
    }

    return {
      ...doc,
      index: skip + idx + 1,
      formattedDate,
      bodyLines: (doc.body || "").split(/\r?\n/),
    };
  });

  res.render("lyric", {
    user: req.session.user,
    lyrics,
    currentPage: page,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  });
});

// GET /lyric/new : 새 일기 작성 폼
exports.showNewLyric = asyncHandler(async (req, res) => {
  res.render("lyric_new", {
    user: req.session.user,
  });
});

// POST /lyric : 새 일기 생성
exports.createLyric = asyncHandler(async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).send("제목과 내용을 모두 입력해 주세요.");
  }

  await Lyric.create({
    user: req.session.user.id,
    title,
    body,
  });

  return res.redirect("/lyric");
});

// GET /lyric/:id : 상세 보기
exports.showLyricDetail = asyncHandler(async (req, res) => {
  const loginUser = req.session.user;
  const { id } = req.params;

  const lyric = await Lyric.findById(id).lean();
  if (!lyric) {
    return res.status(404).send("존재하지 않는 글입니다.");
  }

  const isOwner = lyric.user.toString() === loginUser.id;
  const isAdmin = !!loginUser.isAdmin;

  if (!isOwner && !isAdmin) {
    return res.status(403).send("이 글을 볼 권한이 없습니다.");
  }

  const date = lyric.createdAt ? new Date(lyric.createdAt) : null;
  let formattedDate = "";
  if (date && !Number.isNaN(date.getTime())) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    formattedDate = `${y}.${m}.${d}`;
  }

  res.render("lyric_detail", {
    user: loginUser,
    lyric: {
      ...lyric,
      formattedDate,
      bodyLines: (lyric.body || "").split(/\r?\n/),
    },
  });
});
