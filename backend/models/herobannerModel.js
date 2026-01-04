// backend/models/herobannerModel.js
const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['image', 'video'], 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  titleStyle: {
    color: { type: String, default: '#ffffff' },
    fontSize: { type: Number, default: 48 },
    fontWeight: { type: String, default: 'bold' },
    fontFamily: { type: String, default: 'Arial' }
  },
  subtitle: { 
    type: String, 
    required: true,
    trim: true
  },
  subtitleStyle: {
    color: { type: String, default: '#ffffff' },
    fontSize: { type: Number, default: 20 },
    fontWeight: { type: String, default: 'normal' },
    fontFamily: { type: String, default: 'Arial' }
  },
  mediaUrl: { 
    type: String, 
    required: true 
  },
  ctaText: { 
    type: String, 
    required: true,
    trim: true
  },
  ctaStyle: {
    color: { type: String, default: '#000000' },
    backgroundColor: { type: String, default: '#ffffff' },
    fontSize: { type: Number, default: 16 },
    fontWeight: { type: String, default: 'bold' },
    fontFamily: { type: String, default: 'Arial' }
  },
  ctaLink: { 
    type: String, 
    required: true,
    trim: true
  },
  showButton: { 
    type: Boolean, 
    default: true 
  },
  order: { 
    type: Number, 
    required: true,
    unique: false
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('HeroBanner', heroBannerSchema);
