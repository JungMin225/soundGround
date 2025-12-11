// controllers/loginController.js
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/users");

// GET /login
const getLogin = (req, res) => {
  res.render("login"); // views/login.ejs
};

// POST /login
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).send("아이디가 올바르지 않습니다.");
  }

  // 🔹 bcrypt 사용하는 버전이라면 이렇게 비교:
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("비밀번호가 올바르지 않습니다.");
  }

  // 세션에 관리자 여부까지 포함
  req.session.user = {
    id: user._id.toString(),
    username: user.username,
    name: user.name,
    isAdmin: user.isAdmin || false,
  };

  // 관리자 / 일반 유저 분기
  if (user.isAdmin) {
    // 관리자면 /users(관리자 홈)로
    return res.redirect("/users");
  } else {
    return res.redirect("/home");
  }
});


// GET /register : 회원가입 폼
const getRegister = (req, res) => {
  res.render("add", {
    user: req.session.user || null,
  });
};

// POST /register : 회원가입 처리
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password, password2 } = req.body;

  // 기본 검증
  if (!name || !email || !username || !password || !password2) {
    return res.status(400).send("모든 필드를 입력해 주세요.");
  }

  if (password !== password2) {
    return res.status(400).send("비밀번호가 일치하지 않습니다.");
  }

  // 아이디 중복 체크
  const exists = await User.findOne({ username });
  if (exists) {
    return res.status(400).send("이미 사용 중인 아이디입니다.");
  }

  // 🔹 비밀번호 해시
  const hashedPassword = await bcrypt.hash(password, 10);

  // 유저 생성 (DB에는 해시값만 저장)
  await User.create({
    name,
    email,
    username,
    password: hashedPassword,
  });

  return res.redirect("/login");
});

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("세션 삭제 중 오류:", err);
      return res.status(500).send("로그아웃 중 오류가 발생했습니다.");
    }
    res.redirect("/home");
  });
};

// 🔹 여기서 네 개 전부 export
module.exports = {
  getLogin,
  loginUser,
  getRegister,
  registerUser,
  logoutUser,
};
