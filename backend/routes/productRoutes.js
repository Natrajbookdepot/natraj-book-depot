const express = require('express');
const router = express.Router();
const { getProducts, getProduct } = require('../controllers/productController');

// Route for getting multiple products (by category, subcategory, etc.)
router.get('/', getProducts);

// Route for getting a single product by slug
router.get('/:slug', getProduct);

module.exports = router;
