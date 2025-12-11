// controllers/adminController.js
const asyncHandler = require("express-async-handler");

// 🔹 실제 사용하는 모델 이름/경로에 맞게 수정해 주세요.
const FindPost = require("../models/find");   // 예: models/find.js 에서 module.exports = mongoose.model('FindPost', ...) 라면 이름 맞춰서
const LyricPost = require("../models/lyric"); // 예: models/lyric.js
const Chain = require("../models/chain");     // 이미 있는 체인 모델

/**
 * GET /admin
 * 관리자 대시보드 (간단 요약 + 링크)
 */
const adminDashboard = asyncHandler(async (req, res) => {
  const [findCount, lyricCount, chainCount] = await Promise.all([
    FindPost.countDocuments(),
    LyricPost.countDocuments(),
    Chain.countDocuments(),
  ]);

  res.render("admin_dashboard", {
    findCount,
    lyricCount,
    chainCount,
  });
});

/**
 * Find Ground 관리
 * GET /admin/find
 */
const adminFindList = asyncHandler(async (req, res) => {
  const posts = await FindPost.find({})
    .populate("user", "username name")       // user 필드 ref가 있다면
    .sort({ createdAt: -1 })                 // 최신 글 우선
    .lean();

  res.render("admin_find_list", { posts });
});

/**
 * DELETE /admin/find/:id
 */
const adminDeleteFind = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await FindPost.findByIdAndDelete(id);
  // TODO: 여기서 필요하면 연관된 파일 삭제(fs.unlink 등)도 추가 가능
  res.redirect("/admin/find");
});

/**
 * Lyric Ground 관리
 * GET /admin/lyric
 */
const adminLyricList = asyncHandler(async (req, res) => {
  const posts = await LyricPost.find({})
    .populate("user", "username name")
    .sort({ createdAt: -1 })
    .lean();

  res.render("admin_lyric_list", { posts });
});

/**
 * DELETE /admin/lyric/:id
 */
const adminDeleteLyric = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await LyricPost.findByIdAndDelete(id);
  res.redirect("/admin/lyric");
});

/**
 * Chain Ground 관리
 * GET /admin/chain
 */
const adminChainList = asyncHandler(async (req, res) => {
  const chains = await Chain.find({})
    .populate("user", "username name")
    .sort({ createdAt: -1 })
    .lean();

  res.render("admin_chain_list", { chains });
});

/**
 * DELETE /admin/chain/:id
 */
const adminDeleteChain = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Chain.findByIdAndDelete(id);
  res.redirect("/admin/chain");
});

module.exports = {
  adminDashboard,
  adminFindList,
  adminDeleteFind,
  adminLyricList,
  adminDeleteLyric,
  adminChainList,
  adminDeleteChain,
};
