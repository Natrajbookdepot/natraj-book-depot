const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  categorySlug: { type: String, required: true },
  subcategoryName: { type: String, required: true },
  brand: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }], // Array of image URLs (stored in the DB)
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 10 },
  featured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  ratings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
