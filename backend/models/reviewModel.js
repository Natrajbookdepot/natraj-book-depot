const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },  // Reference to Product
  rating: { type: Number, required: true },                            // Rating (1-5)
  comment: { type: String, required: true },                            // Review comment
  user: { type: String, required: true },                               // Username of the reviewer
  createdAt: { type: Date, default: Date.now }                          // Review submission date
});

module.exports = mongoose.model('Review', reviewSchema);
