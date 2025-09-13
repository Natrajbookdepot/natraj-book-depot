// backend/routes/authRoutes.js
const express  = require("express");
const jwt      = require("jsonwebtoken");
const bcrypt   = require("bcryptjs");
const nodemailer = require("nodemailer");

const User     = require("../models/user");
const Role     = require("../models/roleModel");   // ⬅️ NEW
const sendSMS  = require("../utils/smsSender");

const router   = express.Router();

const JWT_SECRET   = process.env.JWT_SECRET || "your-secret-key";
const OTP_EXPIRE_MS = 5 * 60 * 1_000; // 5 min

const allowedDomains = [
  "gmail.com","hotmail.com","yahoo.com","outlook.com","protonmail.com"
];

// ───────── Validation helpers ─────────────────────────────────────────
function validatePassword(pwd, name, email) {
  if (typeof pwd !== "string" || pwd.length < 8)  return "Password must be at least 8 characters long";
  if (pwd.length > 16)                            return "Password must not exceed 16 characters";
  if (!/[A-Z]/.test(pwd))                         return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(pwd))                         return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(pwd))                         return "Password must contain at least one number";
  if (!/[^A-Za-z0-9]/.test(pwd))                  return "Password must contain at least one special character";
  if (/\s/.test(pwd))                             return "Password must not contain whitespaces";
  if (name  && pwd.toLowerCase() === name.toLowerCase())   return "Password should not be same as username";
  if (email && pwd.toLowerCase() === email.toLowerCase())  return "Password should not be same as email";
  if (/(.)\1\1/.test(pwd))                        return "Password must not contain three same consecutive characters";
  return "";
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Invalid email format";
  const domain = email.split("@")[1];
  if (!allowedDomains.includes(domain))
    return `Email domain must be one of: ${allowedDomains.join(", ")}`;
  return "";
}

function validatePhone(phone) {
  const regex = /^[6-9]\d{9}$/;
  if (!regex.test(phone)) return "Invalid phone number (10 digits required, starting with 6-9)";
  return "";
}

// ───────── Helpers ───────────────────────────────────────────────────
async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST || "smtp.ethereal.email",
    port : process.env.SMTP_PORT || 587,
    auth : { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const info = await transporter.sendMail({
    from: '"Natraj Book Depot" <no-reply@natraj.com>', to, subject, text,
  });
  console.log("Message sent %s", info.messageId);
  if (!process.env.SMTP_HOST || process.env.SMTP_HOST === "smtp.ethereal.email")
    console.log("Preview URL %s", nodemailer.getTestMessageUrl(info));
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ───────── Routes ────────────────────────────────────────────────────
router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user   = await User.findById(id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json({ user });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// ---------- Register -------------------------------------------------
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || (!email && !phone))
    return res.status(400).json({ error: "Missing name and email or phone" });

  if (email) {
    const msg = validateEmail(email.trim());
    if (msg) return res.status(400).json({ error: msg });
  }
  if (phone) {
    const msg = validatePhone(phone.trim());
    if (msg) return res.status(400).json({ error: msg });
  }
  if (password) {
    const msg = validatePassword(password, name, email);
    if (msg) return res.status(400).json({ error: msg });
  }

  const otp        = generateOTP();
  const otpExpiry  = Date.now() + OTP_EXPIRE_MS;
  const hash       = password ? await bcrypt.hash(password, 10) : undefined;

  let user = await User.findOne({ $or: [{ email }, { phone }] });
  if (user && user.verified)
    return res.status(400).json({ error: "User already exists and verified" });

  if (!user) {
    user = new User({ name, email, phone, password: hash, otp, otpExpiry });
  } else {
    user.name      = name;
    user.password  = hash || user.password;
    user.otp       = otp;
    user.otpExpiry = otpExpiry;
  }
  await user.save();

  if (email) await sendEmail(email, "Natraj Book Depot OTP", `Your OTP is: ${otp}`);
  // SMS path kept commented for now.

  res.json({
    success : true,
    userId  : user._id,
    message : "OTP sent via email. SMS OTP is currently disabled.",
  });
});

// ---------- Verify OTP ----------------------------------------------
router.post("/verify-otp", async (req, res) => {
  const { userId, otp } = req.body;
  const user = await User.findById(userId);
  if (!user || !user.otp || !user.otpExpiry ||
      user.otp !== otp || new Date(user.otpExpiry) < new Date())
    return res.status(400).json({ error: "Invalid or expired OTP" });

  user.verified  = true;
  user.otp       = "";
  user.otpExpiry = null;

  /* ✦✦ Fetch permissions from role ✦✦ */
  const roleDoc = await Role.findOne({ name: user.role });
  user.permissions = roleDoc?.permissions?.map(p => p.key) || [];
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res
    .cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" })
    .json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } });
});

// ---------- Login ----------------------------------------------------
router.post("/login", async (req, res) => {
  const { email, phone, password, otp } = req.body;
  let user;

  // email + password login
  if (email && password) {
    user = await User.findOne({ email });
    if (!user || !user.verified)
      return res.status(400).json({ error: "User not found or not verified" });

    const msg = validatePassword(password, user.name, user.email);
    if (msg) return res.status(400).json({ error: msg });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

  // phone + otp login
  } else if (phone && otp) {
    user = await User.findOne({ phone });
    if (!user || !user.verified)
      return res.status(400).json({ error: "User not found or not verified" });

    if (user.otp !== otp || new Date(user.otpExpiry) < new Date())
      return res.status(400).json({ error: "Invalid OTP" });

    user.otp = "";
    user.otpExpiry = null;

  } else {
    return res.status(400).json({ error: "Missing login fields" });
  }

  /* ✦✦ Fetch permissions from role ✦✦ */
  const roleDoc = await Role.findOne({ name: user.role });
  user.permissions = roleDoc?.permissions?.map(p => p.key) || [];
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res
    .cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" })
    .json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } });
});

// ---------- Logout ---------------------------------------------------
router.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

module.exports = router;
