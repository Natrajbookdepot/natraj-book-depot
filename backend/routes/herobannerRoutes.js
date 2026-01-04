// const express = require('express');
// const router = express.Router();
// const HeroBanner = require('../models/herobannerModel');

// const { requireAuth, requirePermission } = require('../middleware/auth');

// // GET all hero banners, sorted by order
// router.get('/', async (req, res) => {
//   try {
//     const banners = await HeroBanner.find().sort({ order: 1 }); // Order by slider sequence
//     res.json(banners);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch hero banners' });
//   }
// });

// // POST create new hero banner (protected)
// router.post('/', requireAuth, requirePermission('canEditProducts'), async (req, res) => {
//   try {
//     const banner = new HeroBanner(req.body);
//     const saved = await banner.save();
//     res.status(201).json(saved);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // PUT update hero banner by id (protected)
// router.put('/:id', requireAuth, requirePermission('canEditProducts'), async (req, res) => {
//   try {
//     const updated = await HeroBanner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!updated) return res.status(404).json({ error: 'Hero banner not found' });
//     res.json(updated);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // DELETE hero banner by id (protected)
// router.delete('/:id', requireAuth, requirePermission('canEditProducts'), async (req, res) => {
//   try {
//     const deleted = await HeroBanner.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ error: 'Hero banner not found' });
//     res.json({ success: true });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const HeroBanner = require('../models/herobannerModel');
const { requireAuth, requirePermission } = require('../middleware/auth');
const multer = require('multer');
const { cloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');

// 🔥 Create uploads/temp directory if not exists
const uploadsDir = path.join(__dirname, '../../uploads/temp');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads/temp directory');
}

// 🔥 Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + 
      path.extname(file.originalname).toLowerCase();
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for videos
  fileFilter 
});

// ✅ PUBLIC GET ROUTE - MUST BE FIRST, NO AUTH
router.get('/', async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ order: 1 });
    console.log('✅ GET /api/herobanners - Sent', banners.length, 'banners');
    res.json(banners);
  } catch (error) {
    console.error('❌ GET banners error:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// 🔥 MEDIA UPLOAD ENDPOINT - Protected
router.post('/uploads/media', 
  requireAuth, 
  requirePermission('canEditProducts'), 
  upload.single('file'),
  async (req, res) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ 
          error: 'No file uploaded' 
        });
      }

      console.log('📤 Uploading:', file.originalname);

      const isVideo = file.mimetype.startsWith('video/');
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: isVideo ? 'video' : 'image',
        folder: 'natraj-book-depot/herobanners',
        quality: 'auto'
      });

      // Cleanup temp file
      fs.unlinkSync(file.path);

      console.log('✅ Upload success:', result.secure_url);
      
      res.json({ 
        url: result.secure_url,
        secure_url: result.secure_url,
        public_id: result.public_id,
        type: isVideo ? 'video' : 'image'
      });

    } catch (error) {
      console.error('❌ Upload error:', error.message);
      
      if (req.file?.path) {
        fs.unlink(req.file.path, () => {});
      }
      
      res.status(500).json({ error: error.message });
    }
  }
);

// POST create banner - Protected
router.post('/', requireAuth, requirePermission('canEditProducts'), async (req, res) => {
  try {
    const bannerData = {
      ...req.body,
      order: parseInt(req.body.order) || 1
    };

    const banner = new HeroBanner(bannerData);
    const saved = await banner.save();
    
    console.log('✅ Created banner:', saved._id);
    res.status(201).json(saved);
  } catch (error) {
    console.error('POST error:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT update banner - Protected
router.put('/:id', requireAuth, requirePermission('canEditProducts'), async (req, res) => {
  try {
    const updated = await HeroBanner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    
    console.log('✅ Updated banner:', updated._id);
    res.json(updated);
  } catch (error) {
    console.error('PUT error:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE banner - Protected
router.delete('/:id', requireAuth, requirePermission('canEditProducts'), async (req, res) => {
  try {
    const deleted = await HeroBanner.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    console.log('🗑️ Deleted banner:', req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
