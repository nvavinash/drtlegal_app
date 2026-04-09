const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Simple helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token valid for 30 days
  });
};

// --- OTP Request Handler ---
// POST /api/auth/request-otp
const requestOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists (No public signup means only existing users can login)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found in our records. Please contact Admin." });
    }

    // Generate a 6 digit secure random OTP
    const _otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 10 minutes from now
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10);

    // Save strictly to DB
    user.otp = _otp;
    user.otpExpires = expires;
    await user.save();

    // Nodemailer logic for Gmail integration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Legal Admin Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Legal Portal - Your Secure OTP",
      text: `Your One-Time Password for login is: ${_otp}. This OTP is valid for 10 minutes. Do not share it with anyone.`,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #0b0b0b;">
            <h2>Legal Portal Access</h2>
            <p>Your secure One-Time Password is:</p>
            <h1 style="color: #c1121f; font-size: 40px; letter-spacing: 5px;">${_otp}</h1>
            <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Error:", error);
        return res.status(500).json({ message: "Failed to send email. Check Nodemailer config in .env" });
      }
      res.status(200).json({ message: "OTP sent successfully to email.", email });
    });

  } catch (error) {
    console.error("OTP generation error:", error);
    res.status(500).json({ message: "Server error during OTP generation." });
  }
};

// --- OTP Verification Handler ---
// POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP matches and hasn't expired
    if (user.otp === otp && user.otpExpires > new Date()) {
      // Clear OTP for security
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      // Send Response with User Info and JWT
      res.status(200).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP. Please request a new one." });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error during verification." });
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
};
