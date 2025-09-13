const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },
    wishlist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    ],

    // === Auth & verification ===
    otp: String,
    otpExpiry: Date,
    verified: { type: Boolean, default: false },

    // === RBAC ===
    role: {
      type: String,
      enum: ["user", "staff", "super-admin"],
      default: "user",
    },
    permissions: [String], // flattened keys for quick checks

    // === Compliance ===
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    consents: [
      {
        type: { type: String },       // "email_marketing"…
        accepted: Boolean,
        at: Date,
      },
    ],
  },
  { timestamps: true }
);

// helpful plugin for better dup-key errors


module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
