const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// @route   GET /api/categories
// @desc    Get all categories (with subcategories)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
