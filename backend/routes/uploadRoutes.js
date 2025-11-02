const express = require('express');
const router  = express.Router();
const { upload } = require('../utils/cloudinary');
const { requireAuth, requirePermission } = require('../middleware/auth');

router.post(
  '/image',
  requireAuth,
  requirePermission('canEditProducts'),
  upload.single('image'),
  (req, res) => {
    // multer-storage-cloudinary puts the CDN URL in req.file.path
    res.json({ url: req.file.path });
  }
);

module.exports = router;
