// routes/contactRoutes.js

const express = require("express");
const router = express.Router();

const { 
  getAllContacts, 
  createContact,
  getContact,
  updateContact,
  deleteContact, 
  addContactForm,
  editContactForm,
  } = require("../controllers/contactController");

const { requireAdmin } = require("../middlewares/auth");

router.use(requireAdmin);

router.route("/add").get(addContactForm).post(createContact);

// app.js 가져오기
router.route("/").get(getAllContacts);

router.get("/:id", editContactForm);

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;