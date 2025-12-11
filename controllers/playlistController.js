// controllers/playlistController.js
const User = require("../models/users");
const Playlist = require("../models/playlist");
const asyncHandler = require("express-async-handler");

/**
 * GET /playlist
 * 플레이리스트를 가진 유저들(또는 전체 유저)을 원형 카드 그리드로 보여주는 화면
 */
const listCreators = asyncHandler(async (req, res) => {
  // 지금은 전체 유저를 다 보여주는 최소 구현
  const users = await User.find({}, "name username").lean();

  const mapped = users.map((u) => ({
    _id: u._id.toString(),
    name: u.name || u.username,
    username: u.username,
    initial: (u.name || u.username || "?").trim().slice(0, 1).toUpperCase(),
    avatarUrl: "", // 나중에 커스텀 이미지 생기면 사용
  }));

  res.render("playlist_index", { users: mapped });
});

/**
 * GET /playlist/:username
 * 프로필 카드 클릭 후, 해당 유저의 플레이리스트 상세 화면 (CD 모양)
 */
const viewByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).lean();
  if (!user) {
    return res.status(404).send("User not found");
  }

  // 한 유저당 플레이리스트 1개라고 가정
  let playlist = await Playlist.findOne({ user: user._id }).lean();

  // 아직 플레이리스트가 없는 경우에도 EJS가 안전하게 동작하도록
  if (!playlist) {
    playlist = null;
  }

  res.render("playlist_show", {
    user,
    playlist, // EJS에서 사용하는 이름
  });
});

/**
 * GET /taste
 * TASTE 폼 화면
 * (주의: 라우트는 routes/tasteRoutes.js에서 /taste로 연결된 상태라고 가정)
 */
const showTasteForm = (req, res) => {
  if (!req.session || !req.session.user) {
    return res.render("need_login");
  }

  res.render("taste", {
    user: req.session.user,
  });
};

/**
 * POST /taste
 * 현재 로그인한 유저의 playlist에 track 추가
 */
const addTrackFromTaste = asyncHandler(async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }

  const { title, artist, coverUrl } = req.body;
  const loginUser = req.session.user; // { id, name, username }

  if (!title) {
    return res.status(400).send("제목은 필수입니다.");
  }

  // 🔹 업로드된 파일
  let audioUrl = "";
  if (req.file) {
    // app.js 에서 /uploads를 static으로 열어두었으므로,
    // 브라우저에서는 /uploads/파일명 으로 접근 가능
    audioUrl = `/uploads/${req.file.filename}`;
  }

  // 1) 이 유저의 플레이리스트 찾기(없으면 생성)
  let playlist = await Playlist.findOne({ user: loginUser.id });

  if (!playlist) {
    playlist = await Playlist.create({
      user: loginUser.id,
      title: `${loginUser.name || loginUser.username}의 Playlist`,
      description: "",
      tracks: [],
    });
  }

  // 2) tracks 배열에 새 트랙 추가
  playlist.tracks.push({
    title,
    artist,
    coverUrl,
    audioUrl, // 🔹 여기 저장
  });

  await playlist.save();

  // 3) 자기 플레이리스트 화면으로 이동
  return res.redirect(`/playlist/${loginUser.username}`);
});


/**
 * 여기서 네 개 함수를 한 번에 export
 */
module.exports = {
  listCreators,
  viewByUsername,
  showTasteForm,
  addTrackFromTaste,
};
