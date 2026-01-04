const Product = require("../models/productModel");
const Category = require("../models/category");
const XLSX = require("xlsx");

// GET multiple products (by category, subcategory, price, etc.)
exports.getProducts = async (req, res) => {
  try {
    const { category, subcategory, min, max, sort } = req.query;

    let filter = {};
    if (category) filter.categorySlug = category;
    if (subcategory) filter.subcategoryName = subcategory;
    if (min || max) filter.price = {};
    if (min) filter.price.$gte = parseInt(min);
    if (max) filter.price.$lte = parseInt(max);

    let query = Product.find(filter);

    // Sorting
    if (sort === "price_asc") query = query.sort({ price: 1 });
    if (sort === "price_desc") query = query.sort({ price: -1 });
    if (sort === "newest") query = query.sort({ createdAt: -1 });

    const products = await query.exec();

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// GET a single product by slug
exports.getProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// POST new product (create)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --- BULK MANAGEMENT ---

// Helper: Ensure category and subcategory exist
const ensureCategory = async (catName, subName) => {
  if (!catName) return { categorySlug: "uncategorized", subcategoryName: "" };

  const slug = catName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  let category = await Category.findOne({
    $or: [{ name: catName }, { slug: slug }]
  });

  if (!category) {
    category = new Category({
      name: catName,
      slug: slug,
      description: `Auto-created during bulk upload`,
      subcategories: subName ? [{ name: subName }] : []
    });
    await category.save();
  } else if (subName) {
    const subExists = category.subcategories.some(s => s.name === subName);
    if (!subExists) {
      category.subcategories.push({ name: subName });
      await category.save();
    }
  }

  return { categorySlug: category.slug, subcategoryName: subName || "" };
};

// 1. Generate Template with Reference Data
exports.generateBulkTemplate = async (req, res) => {
  try {
    const categories = await Category.find({});

    // Sheet 1: Template
    const templateData = [
      {
        Title: "Example Book",
        Slug: "example-book",
        Description: "A great book description",
        Category: "Books",
        Subcategory: "Fiction",
        Brand: "Natraj",
        Price: 499,
        StockCount: 50,
        InStock: "TRUE",
        Featured: "FALSE",
        BestSeller: "TRUE",
        Summary: "Brief summary for top section",
        Specifications: "Brand:Natraj|Pages:200|Size:A4"
      }
    ];
    const wsTemplate = XLSX.utils.json_to_sheet(templateData);

    // Sheet 2: Reference (Available Categories)
    const refData = [];
    categories.forEach(cat => {
      if (cat.subcategories && cat.subcategories.length > 0) {
        cat.subcategories.forEach(sub => {
          refData.push({ Category: cat.name, Subcategory: sub.name });
        });
      } else {
        refData.push({ Category: cat.name, Subcategory: "" });
      }
    });
    const wsRef = XLSX.utils.json_to_sheet(refData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsTemplate, "Product Template");
    XLSX.utils.book_append_sheet(wb, wsRef, "Available Categories");

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=product_upload_template.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Export All Data
exports.exportFullData = async (req, res) => {
  try {
    const products = await Product.find({}).lean();
    const data = products.map(p => ({
      Title: p.title,
      Slug: p.slug,
      Description: p.description,
      Category: p.categorySlug,
      Subcategory: p.subcategoryName,
      Brand: p.brand,
      Price: p.price,
      StockCount: p.stockCount,
      InStock: p.inStock ? "TRUE" : "FALSE",
      Featured: p.featured ? "TRUE" : "FALSE",
      BestSeller: p.bestSeller ? "TRUE" : "FALSE",
      Summary: p.summary || "",
      Specifications: p.specifications?.map(s => `${s.key}:${s.value}`).join("|") || ""
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Products");

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=all_products_export.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Process Upload
exports.processBulkUpload = async (req, res) => {
  try {
    if (!req.body.data) return res.status(400).json({ error: "No data provided" });

    const rows = req.body.data; // Expecting array of objects from frontend
    let createdCount = 0;
    let updatedCount = 0;
    let errors = [];

    for (const [index, row] of rows.entries()) {
      try {
        if (!row.Title || !row.Slug) {
          errors.push(`Row ${index + 1}: Missing Title or Slug`);
          continue;
        }

        // Smart Category Creation/Link
        const { categorySlug, subcategoryName } = await ensureCategory(row.Category, row.Subcategory);

        const productData = {
          title: row.Title,
          slug: row.Slug,
          description: row.Description || "",
          categorySlug: categorySlug,
          subcategoryName: subcategoryName,
          brand: row.Brand || "",
          price: parseFloat(row.Price) || 0,
          stockCount: parseInt(row.StockCount) || 0,
          inStock: String(row.InStock).toUpperCase() === "TRUE",
          featured: String(row.Featured).toUpperCase() === "TRUE",
          bestSeller: String(row.BestSeller).toUpperCase() === "TRUE",
          summary: row.Summary || "",
          specifications: row.Specifications ? row.Specifications.split("|").map(s => {
            const [key, ...valParts] = s.split(":");
            return { key: key?.trim(), value: valParts.join(":")?.trim() };
          }).filter(s => s.key && s.value) : [],
          updatedAt: Date.now()
        };

        const existing = await Product.findOne({ slug: row.Slug });
        if (existing) {
          await Product.findByIdAndUpdate(existing._id, productData);
          updatedCount++;
        } else {
          const newProduct = new Product(productData);
          await newProduct.save();
          createdCount++;
        }
      } catch (e) {
        errors.push(`Row ${index + 1}: ${e.message}`);
      }
    }

    res.json({
      success: true,
      summary: {
        created: createdCount,
        updated: updatedCount,
        failed: errors.length
      },
      errors: errors.slice(0, 10) // Return first 10 errors
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 4. Bulk Delete (Super Admin Only)
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid product IDs" });
    }

    if (req.user.role !== 'super-admin') {
      return res.status(403).json({ error: "Unauthorized. Super Admin Only." });
    }

    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${ids.length} products deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
