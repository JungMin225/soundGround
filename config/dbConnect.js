// config/dbConnect.js
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

// 디버그: 모든 쿼리 네임스페이스(DB.컬렉션)까지 콘솔에 출력
mongoose.set("debug", true);

async function dbConnect() {
  // ⭕ 네가 원하는 변수 이름(DB_CONNECT) 우선, 없으면 MONGO_URI도 허용
  const uri = process.env.DB_CONNECT || process.env.MONGO_URI;

  // 빠르게 문제 잡기용 로그
  console.log("[ENV] DB_CONNECT=", process.env.DB_CONNECT ? "(set)" : "(missing)");
  console.log("[ENV] MONGO_URI =", process.env.MONGO_URI  ? "(set)" : "(missing)");

  if (!uri || typeof uri !== "string") {
    throw new Error(
      "Mongo URI missing. Set DB_CONNECT=<connection string> in .env (또는 MONGO_URI)."
    );
  }

  await mongoose.connect(uri);
  const c = mongoose.connection;
  console.log("MongoDB connected to DB =", c.name); // ← soundGround가 떠야 정상
}

module.exports = dbConnect;
