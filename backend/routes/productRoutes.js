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
  generateBulkTemplate,
  exportFullData,
  processBulkUpload,
  bulkDeleteProducts,
} = require('../controllers/productController');

const router = express.Router();

// BULK management routes
router.get('/bulk/template', requireAuth, requirePermission('canEditProducts'), generateBulkTemplate);
router.get('/bulk/export', requireAuth, requirePermission('canEditProducts'), exportFullData);
router.post('/bulk/upload', requireAuth, requirePermission('canEditProducts'), processBulkUpload);
router.delete('/bulk/delete', requireAuth, requirePermission('canEditProducts'), bulkDeleteProducts);

// PUBLIC routes
router.get('/', getProducts);
router.get('/:slug', getProduct);

// PROTECTED routes - need canEditProducts permission
router.post('/', requireAuth, requirePermission('canEditProducts'), createProduct);
router.put('/:id', requireAuth, requirePermission('canEditProducts'), updateProduct);
router.delete('/:id', requireAuth, requirePermission('canEditProducts'), deleteProduct);

module.exports = router;
