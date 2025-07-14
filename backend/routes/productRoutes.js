const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');

// Get products (by category, subcategory, price etc)
router.get('/', getProducts);

module.exports = router;
