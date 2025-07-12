const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  description: String,
  shopInfo: [{ label: String, url: String }],
  customerCare: [{ label: String, url: String }],
  contact: {
    address: String,
    phone: String,
    email: String,
    hours: String,
  },
  socials: {
    facebook: String,
    instagram: String,
    whatsapp: String,
  },
  legal: [{ label: String, url: String }],
  credit: String,
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  logoUrl: String,
  navLinks: [{ label: String, path: String }],
  footer: footerSchema,
}, { collection: 'settings' }); // <- yahan confirm karo 'settings'

module.exports = mongoose.model('Settings', settingsSchema);
