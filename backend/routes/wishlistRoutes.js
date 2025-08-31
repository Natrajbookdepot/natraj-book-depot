const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Product = require('../models/productModel');

// Middleware to fake-auth user (REPLACE with real auth when ready)
router.use((req, res, next) => {
  // Simulate "session" user via X-User-Id header (frontend will send it)
  req.userId = req.header('X-User-Id') || null;
  next();
});

// GET wishlist (all products)
// router.get('/', async (req, res) => {
//   if (!req.userId) return res.status(401).json({ error: 'Not logged in' });

//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 6;
//   const skip = (page - 1) * limit;

//   const user = await User.findById(req.userId).populate({
//     path: 'wishlist',
//     options: { skip, limit }
//   });

//   if (!user) return res.status(404).json({ error: 'User not found' });

//   // Determine if more items available for pagination
//   const totalWishlistCount = user.wishlist.length;  // length here is limited due to skip/limit, better to count separately
//   // Alternative, count total wishlist items separately:
//   // const totalWishlistCount = await User.aggregate([
//   //   { $match: { _id: mongoose.Types.ObjectId(req.userId) } },
//   //   { $project: { wishlistCount: { $size: "$wishlist" } } }
//   // ]);

//   const hasMore = totalWishlistCount > skip + limit;

//   res.json({
//     items: user.wishlist,
//     hasMore
//   });
// });
router.get('/', async (req, res) => {
  if (!req.userId) {
    console.warn("No userId in wishlist route.");
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.userId).populate({
      path: 'wishlist',
      options: { skip, limit }
    });

    if (!user) {
      console.warn("User not found for wishlist", req.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Log what you're sending to the client
    console.log("Wishlist for user", req.userId, user.wishlist);

    return res.json({
      items: user.wishlist,
      hasMore: (user.wishlist.length > skip + limit)
    });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ error: "Server error", details: err && err.message });
  }
});



// POST add to wishlist
router.post('/add', async (req, res) => {
  const { productId } = req.body;
  if (!req.userId) return res.status(401).json({ error: 'Not logged in' });
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!user.wishlist.includes(productId)) user.wishlist.push(productId);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

// POST remove from wishlist
router.post('/remove', async (req, res) => {
  const { productId } = req.body;
  if (!req.userId) return res.status(401).json({ error: 'Not logged in' });
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

module.exports = router;
