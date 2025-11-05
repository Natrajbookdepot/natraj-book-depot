const Product = require("../models/productModel");

// GET multiple products (by category, subcategory, price, etc.)
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

// GET a single product by slug
exports.getProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// POST new product (create)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
