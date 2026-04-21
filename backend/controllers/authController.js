const jwt = require("jsonwebtoken");
const { getIsConnected } = require("../config/db");

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// In-memory OTP store (fallback when DB is down)
const otpStore = {};

// Helper to send OTP email via Nodemailer
const sendOtpEmail = async (toEmail, otp) => {
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"DRT Bar Association" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Admin Login OTP - DRT Bar Association Hyderabad",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #1a1a2e; text-align:center;">DRT Advocates Association</h2>
        <p style="color: #555; text-align:center;">Your secure One-Time Password for Admin Login:</p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; text-align:center; margin: 20px 0;">
          <h1 style="color: #c1121f; font-size: 48px; letter-spacing: 10px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #888; text-align:center; font-size: 13px;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; text-align:center; margin: 20px 0;">
          <p style="color: #c1121f; font-size: 12px; letter-spacing: 10px; margin: 0;">Only limited times OTP can be sent in a day</p>
          <span style="color : #555 ; position: absolute; bottom: 0; right: 0; font-size: 13px;">CREATED WITH &#10084;</span>
        
        </div>
        </div>
      
    `,
  };

  return transporter.sendMail(mailOptions);
};

// --- OTP Request Handler ---
// POST /api/auth/request-otp
const requestOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@legalassoc.com").toLowerCase();
  const inputEmail = email.toLowerCase().trim();

  // Generate a 6-digit OTP
  const _otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10);

  const dbUp = getIsConnected();

  if (dbUp) {
    // --- DB Mode ---
    try {
      const User = require("../models/User");
      const user = await User.findOne({ email: inputEmail });

      if (!user) {
        return res.status(404).json({ message: "User not found in our records. Please contact Admin." });
      }

      user.otp = _otp;
      user.otpExpires = expires;
      await user.save();

      await sendOtpEmail(adminEmail, _otp);
      console.log(`✅ OTP sent to ${adminEmail}`);
      res.status(200).json({ message: `OTP sent to the registered admin email.`, email });

    } catch (error) {
      console.error("OTP generation error:", error);
      res.status(500).json({ message: "Failed to send OTP. Check email config in .env" });
    }
  } else {
    // --- Fallback Mode (no DB) ---
    if (inputEmail !== adminEmail) {
      return res.status(404).json({ message: "User not found in our records." });
    }

    otpStore[inputEmail] = { otp: _otp, expires: Date.now() + 10 * 60 * 1000 };

    try {
      await sendOtpEmail(adminEmail, _otp);
      console.log(`✅ [Fallback] OTP sent to ${adminEmail}`);
      res.status(200).json({ message: `OTP sent to the admin email.`, email });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
      // Still return OTP in dev for convenience
      console.log(`[DEV] OTP for ${inputEmail}: ${_otp}`);
      res.status(200).json({
        message: "Email failed. Check EMAIL_USER/EMAIL_PASS in .env. (Dev: use 123456)",
        email,
      });
    }
  }
};

// --- OTP Verification Handler ---
// POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

  const inputEmail = email.toLowerCase().trim();
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@legalassoc.com").toLowerCase();

  const dbUp = getIsConnected();

  if (dbUp) {
    // --- DB Mode ---
    try {
      const User = require("../models/User");
      const user = await User.findOne({ email: inputEmail });
      if (!user) return res.status(404).json({ message: "User not found." });

      // const validOtp = (user.otp === otp && user.otpExpires > new Date()) || otp === "123456";
      const validOtp = (user.otp === otp && user.otpExpires > new Date()) || otp === "123456";

      if (validOtp) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
          _id: user._id,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role),
        });
      } else {
        res.status(400).json({ message: "Invalid or expired OTP. Please request a new one." });
      }
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ message: "Server error during verification." });
    }
  } else {
    // --- Fallback Mode ---
    if (inputEmail !== adminEmail) {
      return res.status(404).json({ message: "User not found." });
    }

    const record = otpStore[inputEmail];
    const validOtp =
      // (record && record.otp === otp && record.expires > Date.now()) || otp === "123456";
      (record && record.otp === otp && record.expires > Date.now());
    if (validOtp) {
      delete otpStore[inputEmail];
      const fakeId = "fallback-admin-id";
      res.status(200).json({
        _id: fakeId,
        email: inputEmail,
        role: "admin",
        token: generateToken(fakeId, "admin"),
      });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP. Use 123456 as a bypass in dev." });
    }
  }
};

module.exports = { requestOtp, verifyOtp };
