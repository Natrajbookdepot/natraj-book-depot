const Product = require('../models/productModel');

// GET /api/products?category=notebooks&subcategory=Drawing%20Books&min=50&max=200
exports.getProducts = async (req, res) => {
  try {
    const { category, subcategory, min, max, sort } = req.query;

    let filter = {};
    if (category) filter.categorySlug = category;
    if (subcategory) filter.subcategoryName = subcategory;
    if (min || max) filter.price = {};
    if (min) filter.price.$gte = parseInt(min);
    if (max) filter.price.$lte = parseInt(max);

    let query = Product.find(filter);

    // Sorting
    if (sort === "price_asc") query = query.sort({ price: 1 });
    if (sort === "price_desc") query = query.sort({ price: -1 });
    if (sort === "newest") query = query.sort({ createdAt: -1 });

    const products = await query.exec();

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
