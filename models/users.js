const mongoose = require("mongoose");

// 회원가입 : 이름, 이메일, 아이디, 비밀번호, 비밀번호 확인
// 로그인 : 아이디, 비밀번호
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "이름이 입력되지 않았습니다."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "이메일이 입력되지 않았습니다."],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "이메일 형식이 올바르지 않습니다."],
    },
    username: {
      type: String,
      required: [true, "아이디가 입력되지 않았습니다."],
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    password: {
      type: String,
      required: [true, "비밀번호가 입력되지 않았습니다."],
    },
    password2: { type: String, required: false, select: false },


    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
