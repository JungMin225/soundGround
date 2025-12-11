// controllers/playlistController.js
const User = require("../models/users");
const Playlist = require("../models/playlist");
const asyncHandler = require("express-async-handler");

/**
 * GET /playlist
 * 플레이리스트를 가진 유저들(또는 전체 유저)을 원형 카드 그리드로 보여주는 화면
 */
const listCreators = asyncHandler(async (req, res) => {
  const users = await User.find({}, "name username").lean();

  const mapped = users.map((u) => ({
    _id: u._id.toString(),
    name: u.name || u.username,
    username: u.username,
    initial: (u.name || u.username || "?").trim().slice(0, 1).toUpperCase(),
    avatarUrl: "",
  }));

  res.render("playlist_index", { users: mapped });
});

/**
 * GET /playlist/:username
 */
const viewByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).lean();
  if (!user) {
    return res.status(404).send("User not found");
  }


  let playlist = await Playlist.findOne({ user: user._id }).lean();

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

  let audioUrl = "";
  if (req.file) {

    audioUrl = `/uploads/${req.file.filename}`;
  }

  let playlist = await Playlist.findOne({ user: loginUser.id });

  if (!playlist) {
    playlist = await Playlist.create({
      user: loginUser.id,
      title: `${loginUser.name || loginUser.username}의 Playlist`,
      description: "",
      tracks: [],
    });
  }

  playlist.tracks.push({
    title,
    artist,
    coverUrl,
    audioUrl,
  });

  await playlist.save();

  // 자기 플레이리스트 화면으로 이동
  return res.redirect(`/playlist/${loginUser.username}`);
});


module.exports = {
  listCreators,
  viewByUsername,
  showTasteForm,
  addTrackFromTaste,
};
