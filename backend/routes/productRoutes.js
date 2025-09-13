const express = require('express');
const {
  requireAuth,
  requirePermission,
} = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

// PUBLIC routes
router.get('/', getProducts);
router.get('/:slug', getProduct);

// PROTECTED routes - need canEditProducts permission
router.post('/', requireAuth, requirePermission('canEditProducts'), createProduct);
router.put('/:id', requireAuth, requirePermission('canEditProducts'), updateProduct);
router.delete('/:id', requireAuth, requirePermission('canEditProducts'), deleteProduct);

module.exports = router;
