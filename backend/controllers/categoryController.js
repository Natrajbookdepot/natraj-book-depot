// const Category = require('../models/category');

// // List all categories
// exports.listCategories = async (_req, res) => {
//   try {
//     const categories = await Category.find({});
//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get by slug
// exports.getCategoryBySlug = async (req, res) => {
//   try {
//     const category = await Category.findOne({ slug: req.params.slug });
//     if (!category) return res.status(404).json({ message: 'Category not found!' });
//     res.json(category);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Create a category
// exports.createCategory = async (req, res) => {
//   try {
//     const doc = await Category.create(req.body);
//     res.status(201).json(doc);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Update category
// exports.updateCategory = async (req, res) => {
//   try {
//     const doc = await Category.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!doc) return res.status(404).json({ message: 'Not found' });
//     res.json(doc);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Delete category
// exports.deleteCategory = async (req, res) => {
//   try {
//     const doc = await Category.findByIdAndDelete(req.params.id);
//     if (!doc) return res.status(404).json({ message: 'Not found' });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
const Category = require("../models/category");

// List all categories
exports.listCategories = async (_req, res) => {
  try {
    const allCategories = await Category.find({});
    res.json(allCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found!" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new category (including subcategories array)
exports.createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update category by ID (including subcategories changes)
exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Category not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
