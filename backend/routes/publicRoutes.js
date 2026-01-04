const express = require('express');
const router = express.Router();
const HeroBanner = require('../models/herobannerModel');

// ✅ PUBLIC ROUTES - No auth required
router.get('/herobanners', async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ order: 1 });
    console.log('✅ GET /api/public/herobanners - Sent', banners.length, 'banners');
    res.json(banners);
  } catch (error) {
    console.error('❌ GET banners error:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

module.exports = router;
