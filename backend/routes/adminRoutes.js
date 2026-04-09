const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Protected Admin Routes
router.route("/users").get(protect, adminOnly, getUsers);

module.exports = router;
