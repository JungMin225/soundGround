// routes/chainRoutes.js
const router = require("express").Router();
const {
  showChain,
  postChain,
  showEditChain,
  updateChain,
  deleteChain,
} = require("../controllers/chainController");

router.get("/", showChain);
router.post("/", postChain);

// 수정 페이지
router.get("/:id/edit", showEditChain);

// 수정 처리
router.put("/:id", updateChain);

// 삭제
router.delete("/:id", deleteChain);

module.exports = router;
