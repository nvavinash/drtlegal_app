const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  addMember,
  getMembers,
  getAllMembersAdmin,
  getMemberById,
  updateMember,
  deleteMember,
  downloadMemberPdf,
} = require("../controllers/memberController");

// Public routes
router.post("/", upload.single("photo"), addMember);        // submit application (public)
router.get("/", getMembers);                                 // get approved members (public)

// Admin-only routes
router.get("/all", protect, adminOnly, getAllMembersAdmin);  // get all members
router.get("/:id/pdf", protect, adminOnly, downloadMemberPdf); // download member PDF — must come before /:id
router.get("/:id", protect, adminOnly, getMemberById);       // get single member
router.put("/:id", protect, adminOnly, upload.single("photo"), updateMember); // update / approve
router.delete("/:id", protect, adminOnly, deleteMember);    // delete member

module.exports = router;
