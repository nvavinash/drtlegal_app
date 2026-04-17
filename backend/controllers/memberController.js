const Member = require("../models/Member");

// POST /api/members → Add member
const addMember = async (req, res) => {
  try {
    const { name, email, phone, enrollmentNumber, isPaid } = req.body;
    let photo = null;

    if (req.file) {
      // Store relative path to easily serve via static route
      photo = `/uploads/${req.file.filename}`;
    }

    const newMember = new Member({
      name,
      email,
      phone,
      enrollmentNumber,
      isPaid: isPaid === "true" || isPaid === true, // handling FormData stringification
      photo,
    });

    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Failed to add member", error: error.message });
  }
};

// GET /api/members → Get all members
const getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Failed to fetch members" });
  }
};

// GET /api/members/:id → Get single member
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ message: "Failed to fetch member" });
  }
};

// PUT /api/members/:id → Update member
const updateMember = async (req, res) => {
  try {
    const { name, email, phone, enrollmentNumber, status } = req.body;

    let updateFields = { name, email, phone, enrollmentNumber, status };
    if (req.file) {
      updateFields.photo = `/uploads/${req.file.filename}`;
    }

    // Remove undefined fields
    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "Failed to update member" });
  }
};

// DELETE /api/members/:id → Delete member
const deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Failed to delete member" });
  }
};

module.exports = {
  addMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
