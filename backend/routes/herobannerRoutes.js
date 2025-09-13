const express = require('express');
const router = express.Router();
const HeroBanner = require('../models/herobannerModel');

const { requireAuth, requirePermission } = require('../middleware/auth');

// GET all hero banners, sorted by order
router.get('/', async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ order: 1 }); // Order by slider sequence
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hero banners' });
  }
});

// POST create new hero banner (protected)
router.post('/', requireAuth, requirePermission('canEditProducts'), async (req, res) => {
  try {
    const banner = new HeroBanner(req.body);
    const saved = await banner.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update hero banner by id (protected)
router.put('/:id', requireAuth, requirePermission('canEditProducts'), async (req, res) => {
  try {
    const updated = await HeroBanner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Hero banner not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE hero banner by id (protected)
router.delete('/:id', requireAuth, requirePermission('canEditProducts'), async (req, res) => {
  try {
    const deleted = await HeroBanner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Hero banner not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
