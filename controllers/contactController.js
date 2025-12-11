const asyncHandler = require("express-async-handler");
const User = require("../models/users");

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

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {

    return res.redirect(303, "/users?error=exists");;
  }

  await User.create({ name, email, username, password, password2 });

  return res.redirect(303, "/users");
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
// 수정 폼 렌더: GET /users/:id
const editContactForm = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) return res.status(404).send("User not found");
  res.render("update", { user }); // views/update.ejs
});





// 수정 처리: PUT /users/:id


const updateContact = asyncHandler(async (req, res) => {

  
  const id = req.params.id;
  const { name, email, username, password, password2 } = req.body;

  const update = {};
  if (name !== undefined) update.name = name;
  if (email !== undefined) update.email = email;
  if (username !== undefined) update.username = username;

  const exists = await User.findOne({
    _id: { $ne: id },
    $or: [{ email }, { username }]
  }).lean();
  if (exists) {

    return res.redirect(303, `/users/${id}?error=exists`);
  }

  const p1 = (password ?? '').trim();
  const p2 = (password2 ?? '').trim();

  if (p1 || p2) {

    if (!p1 || !p2) {
      return res.status(400).send("비밀번호와 확인을 모두 입력해주세요.");
    }
    // 불일치
    if (p1 !== p2) {
      return res.status(400).send("비밀번호가 일치하지 않습니다.");
    }

    if (p1.length < 4) {
      return res.status(400).send("비밀번호는 4자 이상이어야 합니다.");
    }

    update.password = p1;
    update.password2 = p2;
  }


  // 저장
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
