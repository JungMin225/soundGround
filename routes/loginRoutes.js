// routes/loginRoutes.js
const express = require("express");
const router = express.Router();

const { 
  getLogin, 
  loginUser,
  getRegister,
  registerUser,
  logoutUser,
} = require("../controllers/loginController");

// 로그인 페이지
router.get("/login", getLogin);

// 로그인 처리
router.post("/login", loginUser);

// 회원가입 페이지
router.get("/register", getRegister);

// 회원가입 처리
router.post("/register", registerUser);

// 로그아웃 처리
router.post("/logout", logoutUser);

module.exports = router;
