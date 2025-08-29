const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Product = require('../models/productModel');

// Middleware to fake-auth user (REPLACE with real auth when ready)
router.use((req, res, next) => {
  // Simulate "session" user via X-User-Id header (frontend will send it)
  req.userId = req.header('X-User-Id') || null;
  next();
});

// GET wishlist (all products)
router.get('/', async (req, res) => {
  if (!req.userId) return res.status(401).json({ error: 'Not logged in' });
  const user = await User.findById(req.userId).populate('wishlist');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user.wishlist);
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
