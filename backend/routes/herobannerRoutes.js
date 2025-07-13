// backend/routes/herobannerRoutes.js
const express = require('express');
const router = express.Router();
const HeroBanner = require('../models/herobannerModel');

// GET all hero banners, sorted by order
router.get('/', async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ order: 1 }); // Order by slider sequence
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hero banners' });
  }
});

module.exports = router;
