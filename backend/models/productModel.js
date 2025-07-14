// backend/models/productModel.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },               // Product name
  slug: { type: String, required: true, unique: true },  // For URLs
  description: { type: String },                         // Full description
  categorySlug: { type: String, required: true },        // e.g., 'notebooks'
  subcategoryName: { type: String, required: true },     // e.g., 'Drawing Books'
  brand: { type: String },                               // Brand name (optional)
  price: { type: Number, required: true },               // MRP or selling price
  images: [{ type: String }],                            // Array of URLs (S3, CDN, local, etc.)
  inStock: { type: Boolean, default: true },             // In stock status
  stockCount: { type: Number, default: 10 },             // Qty available
  featured: { type: Boolean, default: false },           // For home page
  bestSeller: { type: Boolean, default: false },         // For analytics
  ratings: { type: Number, default: 0 },                 // Avg. user rating
  createdAt: { type: Date, default: Date.now },          // For sorting/filter
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
