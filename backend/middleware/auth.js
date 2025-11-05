const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;

// === Require User is Authenticated ===
exports.requireAuth = (req, res, next) => {
  // Always use Authorization header first for React/Vite/SPA dev setup!
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  if (!token) {
    console.warn("[AUTH] No token found in headers or cookies");
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("[AUTH] DECODED JWT:", decoded);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error("[AUTH] JWT VERIFY ERROR:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// === Require User has Specific Role(s) ===
exports.requireRole = (...allowedRoles) => async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (allowedRoles.includes(req.user.role)) return next();
  return res.status(403).json({ error: "Forbidden" });
};

// === Require User has Permission (or super-admin shortcut) ===
exports.requirePermission = (permKey) => async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  
  // Super-admin shortcut
  if (req.user.role === "super-admin") {
    console.log("[AUTH] SUPER-ADMIN OVERRIDE for", permKey);
    return next();
  }

  try {
    const user = await User.findById(req.user.id).select("permissions role");
    console.log("[AUTH] PERMISSION CHECK", permKey, "FOR", user?.role, "|", user?.permissions);
    if (user?.permissions?.includes(permKey)) return next();
    return res.status(403).json({ error: "Forbidden" });
  } catch (err) {
    console.error("[AUTH] DB Permission check failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
