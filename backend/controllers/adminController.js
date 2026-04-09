const User = require("../models/User");

// --- Get All Users ---
// GET /api/admin/users
// Private/Admin
const getUsers = async (req, res) => {
  try {
    // Select all fields except OTP logic
    const users = await User.find({}).select("-otp -otpExpires");
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Failed to fetch users from database." });
  }
};

module.exports = {
  getUsers,
};
