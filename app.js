const express = require("express");
const dbConnect = require("./config/dbConnect");
const methodOverride = require("method-override");
const session = require("express-session"); 
const path = require("path");

const app = express();
// const port = 3333;
const port = process.env.PORT || 3000;


// DB 연결
dbConnect();

// 뷰 엔진 설정
app.set("view engine", "ejs");
app.set("views", "./views");

// 공통 미들웨어
app.use(express.static("./public"));               
app.use(express.json());                           
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method")); 
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// 세션 미들웨어
app.use(
  session({
    secret: "soundground-secret",   //git에 올리지 않는 게 좋음
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 요청 시간 찍는 미들웨어
const requestTime = (req, res, next) => {
  let today = new Date();
  let now = today.toLocaleTimeString();
  req.requestTime = now;
  next();
};
app.use(requestTime);

// ===== 라우트 설정 =====

// 기본 루트 > /home
app.get("/", (req, res) => {
  res.redirect("/home");
});

// 홈
app.get("/home", (req, res) => {
  res.render("home");
});

// 로그인 / 회원가입
app.use("/", require("./routes/loginRoutes"));

// 관리자 전용
app.use("/admin", require("./routes/adminRoutes"));

// 플레이리스트 
app.use("/playlist", require("./routes/playlistRoutes"));

// 회원 목록 / 회원 추가 
app.use("/users", require("./routes/contactRoutes"));

// 플레이리스트 노래 등록
app.use('/taste', require('./routes/tasteRoutes'));

// 노래 가사 끝말잇기
app.use("/chain", require("./routes/chainRoutes"));

// 노래 찾기 커뮤니티
app.use("/find", require("./routes/findRoutes"));

// 가사 일기
app.use("/lyric", require("./routes/lyricRoutes"));


// 서버 실행
app.listen(port, () => {
  console.log(`${port}번 포트에서 서버 실행 중`);
});


