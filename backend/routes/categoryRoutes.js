const express = require("express");
const {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { requireAuth, requirePermission } = require("../middleware/auth");

const router = express.Router();

// Public
router.get("/", listCategories);
router.get("/:slug", getCategoryBySlug);

// Protected (require canEditProducts permission)
router.post("/", requireAuth, requirePermission("canEditProducts"), createCategory);
router.put("/:id", requireAuth, requirePermission("canEditProducts"), updateCategory);
router.delete("/:id", requireAuth, requirePermission("canEditProducts"), deleteCategory);

module.exports = router;
