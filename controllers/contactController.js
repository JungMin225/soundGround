const asyncHandler = require("express-async-handler");
const User = require("../models/users"); // ← User로 임포트

// @desc Create (회원가입)
// @route POST /users
const createContact = asyncHandler(async (req, res) => {
  const { name, email, username, password, password2 } = req.body;

  if (!name || !email || !username || !password || !password2) {
    return res.status(400).send("필수값이 입력되지 않았습니다.");
  }
  if (password !== password2) {
    return res.status(400).send("비밀번호가 일치하지 않습니다.");
  }

  // 중복 방지(선택)
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    // 에러 페이지 없이 목록으로 보내고 싶다면 쿼리로 표시
    return res.redirect(303, "/users?error=exists");
    // 또는 JSON으로 에러 내고 싶으면:
    // return res.status(409).send("이미 존재하는 이메일/아이디입니다.");
  }

  await User.create({ name, email, username, password, password2 });

  // ★ 성공 시 목록으로 이동
  return res.redirect(303, "/users"); // 303: POST 이후 안전한 GET 리다이렉트
});

// @desc Get all users
// @route GET /users
const getAllContacts = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.render("index", { users });
});

// @desc Get user
// @route GET /users/:id
const getContact = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).send(user);
});

// @desc Update user
// @route PUT /users/:id
// ★ 수정 폼 렌더: GET /users/:id
const editContactForm = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) return res.status(404).send("User not found");
  res.render("update", { user }); // views/update.ejs
});





// ★ 수정 처리: PUT /users/:id


const updateContact = asyncHandler(async (req, res) => {

  
  const id = req.params.id;
  const { name, email, username, password, password2 } = req.body;

  // 1) 기본 정보 업데이트 셋업
  const update = {};
  if (name !== undefined) update.name = name;
  if (email !== undefined) update.email = email;
  if (username !== undefined) update.username = username;

  // 2) 이메일/아이디 중복 체크(본인 제외)
  const exists = await User.findOne({
    _id: { $ne: id },
    $or: [{ email }, { username }]
  }).lean();
  if (exists) {
    // 에러를 쿼리로 표시하고 수정 폼으로 되돌리기
    return res.redirect(303, `/users/${id}?error=exists`);
  }

  // 3) 비밀번호 변경 규칙
  const p1 = (password ?? '').trim();
  const p2 = (password2 ?? '').trim();

  if (p1 || p2) {
    // 둘 중 하나만 채웠을 때
    if (!p1 || !p2) {
      return res.status(400).send("비밀번호와 확인을 모두 입력해주세요.");
    }
    // 불일치
    if (p1 !== p2) {
      return res.status(400).send("비밀번호가 일치하지 않습니다.");
    }
    // (옵션) 최소 길이 등 검증
    if (p1.length < 4) {
      return res.status(400).send("비밀번호는 4자 이상이어야 합니다.");
    }
    // 해시 없이 평문 저장(연습용) — 나중에 bcrypt로 바꾸세요.
    update.password = p1;
    update.password2 = p2; // 스키마 호환 때문에 유지(실서비스에서는 저장 안 함 권장)
  }
  // 둘 다 빈칸이면 비밀번호는 업데이트하지 않음

  // 4) 저장
  const updated = await User.findByIdAndUpdate(id, update, { new: true });
  if (!updated) return res.status(404).send("User not found");

  return res.redirect(303, "/users");
});

// @desc Delete user
// @route DELETE /users/:id
const deleteContact = asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/users");
  });


// @desc View add contact from
// @route GET /contacts/add
const addContactForm = (req,res) => {
  res.render("add"); // views/add.ejs 렌더링하기
};


module.exports = {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
  addContactForm,
  editContactForm,
};
