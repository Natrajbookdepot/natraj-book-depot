const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, lowercase: true, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String },
  otp: { type: String },         // <--- must be present
  otpExpiry: { type: Date },     // <--- must be present
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
