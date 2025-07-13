const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
  name: String,
  exampleProducts: [String] // Example product names
}, { _id: false });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  color: String,
  subcategories: [SubcategorySchema], // Subcategories embedded
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema);
