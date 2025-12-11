// models/find.js
const mongoose = require("mongoose");

const findSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // 로그인 유저만 글 작성한다고 가정
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    // 음원 첨부 파일 (선택)
    filePath: {
      type: String,      // 실제 서버 내 저장 경로 or URL
    },
    fileOriginalName: {
      type: String,      // 사용자가 업로드한 원래 파일명
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

module.exports = mongoose.model("Find", findSchema);
