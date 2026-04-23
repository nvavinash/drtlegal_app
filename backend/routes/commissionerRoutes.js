const express = require("express");
const router = express.Router();
const {
  initQueue,
  getNextCommissioner,
  getCommissionerList,
} = require("../controllers/commissionerController");
const { protect, adminOnly, editorOrAdmin } = require("../middleware/authMiddleware");

// GET  /api/commissioners          — list all COP members with experience & queue status
router.get("/", protect, getCommissionerList);

// GET  /api/commissioners/next     — get & assign next commissioner (admin + editor)
router.get("/next", protect, editorOrAdmin, getNextCommissioner);

// POST /api/commissioners/init     — rebuild queue (admin only)
router.post("/init", protect, adminOnly, initQueue);

module.exports = router;
