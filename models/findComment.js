// models/findComment.js
const mongoose = require("mongoose");

const findCommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Find", // 어떤 Find 게시글에 달린 댓글인지
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 어떤 유저가 썼는지
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("FindComment", findCommentSchema);
