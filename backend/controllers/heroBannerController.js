const HeroBanner = require('../models/herobannerModel');

// List all hero banners - PUBLIC
exports.listHeroBanners = async (_req, res) => {
  try {
    const banners = await HeroBanner.find({}).sort({ order: 1 });
    console.log('✅ GET /api/herobanners - Sent', banners.length, 'banners');
    res.json(banners);
  } catch (err) {
    console.error('❌ Error fetching banners:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create new hero banner
exports.createHeroBanner = async (req, res) => {
  try {
    const banner = new HeroBanner(req.body);
    const saved = await banner.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update hero banner by id
exports.updateHeroBanner = async (req, res) => {
  try {
    const updated = await HeroBanner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Hero banner not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete hero banner by id
exports.deleteHeroBanner = async (req, res) => {
  try {
    const deleted = await HeroBanner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Hero banner not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
