const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

// @route   GET /api/reviews/:productId
// @desc    Get all reviews for a product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/reviews/:productId
// @desc    Post a review for a product
// @access  Public
router.post('/:productId', async (req, res) => {
  try {
    const { rating, comment, user } = req.body;
    const review = new Review({
      productId: req.params.productId,
      rating,
      comment,
      user,
    });
    await review.save();

    // Optionally, update product rating here
    const product = await Product.findById(req.params.productId);
    const reviews = await Review.find({ productId: req.params.productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    product.ratings = avgRating;
    await product.save();

    res.json({ message: "Review submitted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
