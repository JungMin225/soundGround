// config/dbConnect.js
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

mongoose.set("debug", true);

async function dbConnect() {
  const uri = process.env.DB_CONNECT || process.env.MONGO_URI;

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
