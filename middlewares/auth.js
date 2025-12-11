// middlewares/auth.js

// 로그인 필수
function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// 관리자 필수
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user || !req.session.user.isAdmin) {
    // 권한 없음
    return res.status(403).send("관리자만 접근할 수 있습니다.");
    // 또는: return res.redirect("/home");
  }
  next();
}

module.exports = {
  requireLogin,
  requireAdmin,
};
