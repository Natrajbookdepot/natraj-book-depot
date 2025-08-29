const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendSMS = require("../utils/smsSender"); // Create this as in previous instructions
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const OTP_EXPIRE_MS = 5 * 60 * 1000; // 5 minutes expire

function generateOTP() {
  return ('' + Math.floor(100000 + Math.random() * 900000));
}

async function sendEmail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const info = await transporter.sendMail({ from: '"Natraj Book Depot" <no-reply@natraj.com>', to, subject, text });
  console.log("Message sent: %s", info.messageId);
  if (process.env.SMTP_HOST === "smtp.ethereal.email" || process.env.SMTP_HOST === undefined) {
    // Only Ethereal gives preview url
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
}

router.get("/me", (req, res) => {
  // Read user from cookie JWT
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const userData = jwt.verify(token, JWT_SECRET);
    User.findById(userData.id).then((user) => res.json({ user })).catch(() => res.status(404).json({ error: "Not found" }));
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});


router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || (!email && !phone)) return res.status(400).json({ error: "Missing name and email or phone" });

  let otp = generateOTP();
  let otpExpiry = Date.now() + OTP_EXPIRE_MS;
  let hash = password ? await bcrypt.hash(password, 10) : undefined;

  let user = await User.findOne({ $or: [{ email }, { phone }] });
  if (user && user.verified) return res.status(400).json({ error: "User already exists and verified" });

  if (!user) {
    user = new User({ name, email, phone, password: hash, otp, otpExpiry });
    await user.save();
  } else {
    user.name = name;
    user.password = hash || user.password;
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
  }

  if (email) await sendEmail(email, "Natraj Book Depot OTP", `Your OTP is: ${otp}`);
//   if (phone) {
//     let formattedPhone = phone.startsWith("+") ? phone : "+91" + phone;
//     try {
//       await sendSMS(formattedPhone, `Your Natraj Book Depot OTP is: ${otp}`);
//     } catch (err) {
//       console.error("SMS send failed:", err);
//     }
//   }

 res.json({ success: true, userId: user._id, message: "OTP sent via email. SMS OTP is currently disabled." });
});

router.post("/verify-otp", async (req, res) => {
  const { userId, otp } = req.body;
  let user = await User.findById(userId);
  if (!user || !user.otp || !user.otpExpiry || user.otp !== otp || new Date(user.otpExpiry) < new Date()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.verified = true;
  user.otp = "";
  user.otpExpiry = null;
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
  res.json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } });
});

router.post("/login", async (req, res) => {
  const { email, phone, password, otp } = req.body;
  let user;
  if (email && password) {
    user = await User.findOne({ email });
    if (!user || !user.verified) return res.status(400).json({ error: "User not found or not verified" });
    if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: "Incorrect password" });
  }
  else if (phone && otp) {
    user = await User.findOne({ phone });
    if (!user || !user.verified) return res.status(400).json({ error: "User not found or not verified" });
    if (user.otp !== otp || new Date(user.otpExpiry) < new Date()) return res.status(400).json({ error: "Invalid OTP" });
    user.otp = "";
    user.otpExpiry = null;
    await user.save();
  }
  else {
    return res.status(400).json({ error: "Missing login fields" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
  res.json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

module.exports = router;
