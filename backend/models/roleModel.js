// backend/models/roleModel.js
const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },           // e.g. "canEditProducts"
    label: { type: String, required: true },         // human-readable text
  },
  { _id: false }
);

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true }, // "super-admin", "staff"
    permissions: [permissionSchema],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Role || mongoose.model("Role", roleSchema);
