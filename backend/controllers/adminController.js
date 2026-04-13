const User = require("../models/User");
const Virtual = require("../models/Virtual");

// --- Get All Users ---
// GET /api/admin/users
// Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-otp -otpExpires");
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Failed to fetch users from database." });
  }
};

// --- Get Virtual Settings ---
// GET /api/admin/virtual
// Public or Private (depending on use case, here we might want public for home page)
const getVirtual = async (req, res) => {
  try {
    const settings = await Virtual.find({});
    // Transform to simple key-value object
    const config = {};
    settings.forEach(s => config[s.key] = s.value);
    res.status(200).json(config);
  } catch (error) {
    console.error("Fetch virtual error:", error);
    res.status(500).json({ message: "Failed to fetch virtual settings." });
  }
};

// --- Update Virtual Settings ---
// POST /api/admin/virtual
// Private/Admin
const updateVirtual = async (req, res) => {
  const { settings } = req.body; // Expecting { key: value, ... }
  
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ message: "Invalid settings format." });
  }

  try {
    const promises = Object.entries(settings).map(([key, value]) => 
      Virtual.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      )
    );
    await Promise.all(promises);
    res.status(200).json({ message: "Settings updated successfully." });
  } catch (error) {
    console.error("Update virtual error:", error);
    res.status(500).json({ message: "Failed to update settings." });
  }
};

module.exports = {
  getUsers,
  getVirtual,
  updateVirtual,
};
