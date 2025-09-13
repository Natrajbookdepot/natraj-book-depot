// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;            // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

exports.requireRole = (...allowed) => async (req, res, next) => {
  // requireAuth must have run
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  if (allowed.includes(req.user.role)) return next();
  return res.status(403).json({ error: "Forbidden" });
};

exports.requirePermission = (permKey) => async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  // super-admin shortcut
  if (req.user.role === "super-admin") return next();

  const user = await User.findById(req.user.id).select("permissions");
  if (user?.permissions?.includes(permKey)) return next();

  return res.status(403).json({ error: "Forbidden" });
};
