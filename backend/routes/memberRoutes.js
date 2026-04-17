const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  addMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");

// Member routes
router.post("/", upload.single("photo"), addMember);
router.get("/", getMembers);
router.get("/:id", getMemberById);
router.put("/:id", upload.single("photo"), updateMember);
router.delete("/:id", deleteMember);

module.exports = router;
