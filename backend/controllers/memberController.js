const Member = require("../models/Member");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// POST /api/members → Public – submit membership application
const addMember = async (req, res) => {
  try {
    const {
      name, gender, phone, email, address, state,
      dob, bloodGroup, enrollmentNumber, enrollmentDate,
      membershipType, membershipDate, membershipFee,
      transactionNumber, amountPaid, paymentTime,
    } = req.body;

    let photo = null;
    if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    }

    const newMember = new Member({
      name, gender, phone, email, address,
      state: state || "Telangana",
      dob, bloodGroup, enrollmentNumber, enrollmentDate,
      membershipType, membershipDate, membershipFee,
      transactionNumber, amountPaid, paymentTime,
      photo,
    });

    const saved = await newMember.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Failed to add member", error: error.message });
  }
};

// GET /api/members → Public – get all APPROVED members
const getMembers = async (req, res) => {
  try {
    const members = await Member.find({ status: "Approved" })
      .select("name enrollmentNumber phone email address status photo membershipType createdAt")
      .sort({ name: 1 });
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Failed to fetch members" });
  }
};

// GET /api/members/all → Admin – get ALL members (any status)
const getAllMembersAdmin = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching all members:", error);
    res.status(500).json({ message: "Failed to fetch members" });
  }
};

// GET /api/members/:id → Get single member
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.status(200).json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ message: "Failed to fetch member" });
  }
};

// PUT /api/members/:id → Admin – update any field including status
const updateMember = async (req, res) => {
  try {
    const updateFields = { ...req.body };
    if (req.file) {
      updateFields.photo = `/uploads/${req.file.filename}`;
    }
    // Remove undefined keys
    Object.keys(updateFields).forEach(
      (k) => updateFields[k] === undefined && delete updateFields[k]
    );

    const updated = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Member not found" });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "Failed to update member" });
  }
};

// DELETE /api/members/:id → Admin only
const deleteMember = async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Member not found" });
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Failed to delete member" });
  }
};

// GET /api/members/:id/pdf → Admin only
const downloadMemberPdf = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Ensure headers support file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Member_Application_${member.name.replace(/\s+/g, "_")}.pdf"`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Member Application Form", { align: "center" });
    doc.moveDown();

    // Render photo if available
    if (member.photo) {
      const photoPath = path.join(__dirname, "..", member.photo);
      if (fs.existsSync(photoPath)) {
        doc.image(photoPath, 50, 90, { width: 100 });
      } else {
        doc.fontSize(10).fillColor("gray").text("[Photo not available]", 50, 90);
        doc.fillColor("black");
      }
    }
    
    // Position text below photo
    let startY = 210;

    const addField = (label, value) => {
      doc.fontSize(12).font("Helvetica-Bold").text(`${label}:`, 50, startY, { continued: true });
      doc.font("Helvetica").text(` ${value || "N/A"}`);
      startY += 20;
    };

    addField("Name", member.name);
    addField("Gender", member.gender);
    addField("Phone", member.phone);
    addField("Email", member.email);
    addField("Address", member.address);
    addField("State", member.state);
    addField("DOB", member.dob);
    addField("Blood Group", member.bloodGroup);
    
    doc.moveDown();
    startY += 10;
    doc.fontSize(14).font("Helvetica-Bold").text("Enrollment & Membership Details", 50, startY);
    startY += 25;

    addField("Enrollment No.", member.enrollmentNumber);
    addField("Enrollment Date", member.enrollmentDate);
    addField("Membership Type", member.membershipType);
    addField("Membership Date", member.membershipDate);

    doc.moveDown();
    startY += 10;
    doc.fontSize(14).font("Helvetica-Bold").text("Payment & Status", 50, startY);
    startY += 25;

    addField("Membership Fee", member.membershipFee);
    addField("Amount Paid", member.amountPaid);
    addField("Transaction No.", member.transactionNumber);
    addField("Payment Time", member.paymentTime);
    addField("Application Status", member.status);

    doc.end();

  } catch (error) {
    console.error("Error generating PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  }
};

module.exports = {
  addMember,
  getMembers,
  getAllMembersAdmin,
  getMemberById,
  updateMember,
  deleteMember,
  downloadMemberPdf,
};
