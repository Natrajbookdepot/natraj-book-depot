// backend/models/herobannerModel.js
const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  mediaUrl: { type: String, required: true }, // image ya video ka path
  ctaText: { type: String, required: true },
  ctaLink: { type: String, required: true },
  showButton: { type: Boolean, default: true },
  order: { type: Number, required: true }, // slider order/sequence
});

module.exports = mongoose.model('HeroBanner', heroBannerSchema);
