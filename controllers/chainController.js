// controllers/chainController.js
const asyncHandler = require("express-async-handler");
const Chain = require("../models/chain");

// GET /chain  : 체인 페이지
exports.showChain = asyncHandler(async (req, res) => {
  const chains = await Chain.find({})
    .sort({ createdAt: -1 }) // 🔁 최신 글이 위로 오도록 변경
    .lean();

  const currentUserId = req.session.user ? String(req.session.user.id) : null;

  res.render("chain", {
    user: req.session.user || null,
    currentUserId,
    chains,
  });
});


// POST /chain : 새 가사 등록
exports.postChain = asyncHandler(async (req, res) => {
  // 로그인 안 되어 있으면 로그인 팝업 → 이동
  if (!req.session || !req.session.user) {
    return res.render("need_login");
  }

  const { lyric, title, artist } = req.body;

  if (!lyric || !title || !artist) {
    // 간단한 검증
    return res.status(400).send("가사, 제목, 가수를 모두 입력해 주세요.");
  }

  await Chain.create({
    user: req.session.user.id,
    lyric,
    title,
    artist,
  });

  // 등록 후 다시 리스트 상단으로
  return res.redirect("/chain#chain-list");
});


// GET /chain/:id/edit : 가사 수정 페이지
exports.showEditChain = asyncHandler(async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.render("need_login");
  }

  const chain = await Chain.findById(req.params.id).lean();

  if (!chain) {
    return res.status(404).send("해당 가사를 찾을 수 없습니다.");
  }

  // 작성자만 접근 가능
  if (String(chain.user) !== String(req.session.user.id)) {
    return res.status(403).send("본인이 작성한 가사만 수정할 수 있습니다.");
  }

  res.render("chain_edit", {
    user: req.session.user,
    chain,
  });
});


// PUT /chain/:id : 가사 수정 처리
exports.updateChain = asyncHandler(async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.render("need_login");
  }

  const chain = await Chain.findById(req.params.id);

  if (!chain) {
    return res.status(404).send("해당 가사를 찾을 수 없습니다.");
  }

  // 작성자만 수정 가능
  if (String(chain.user) !== String(req.session.user.id)) {
    return res.status(403).send("본인이 작성한 가사만 수정할 수 있습니다.");
  }

  const { lyric, title, artist } = req.body;

  if (!lyric || !title || !artist) {
    return res.status(400).send("가사, 제목, 가수를 모두 입력해 주세요.");
  }

  chain.lyric = lyric;
  chain.title = title;
  chain.artist = artist;
  await chain.save();

  return res.redirect("/chain#chain-list");
});


// DELETE /chain/:id : 가사 삭제
exports.deleteChain = asyncHandler(async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.render("need_login");
  }

  const chain = await Chain.findById(req.params.id);

  if (!chain) {
    return res.status(404).send("해당 가사를 찾을 수 없습니다.");
  }

  // 작성자만 삭제 가능
  if (String(chain.user) !== String(req.session.user.id)) {
    return res.status(403).send("본인이 작성한 가사만 삭제할 수 있습니다.");
  }

  await chain.deleteOne();

  return res.redirect("/chain#chain-list");
});
