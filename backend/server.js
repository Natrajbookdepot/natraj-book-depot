const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

mongoose.set("debug", false);
mongoose.set("strictQuery", true);
mongoose.set("runValidators", true);

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// ─── Static Assets ─────────────────────────────────────────────────────────────
// Serve images from frontend/public/images/ and backend/uploads/ directories
app.use('/category', express.static(path.join(__dirname, '../frontend/public/category')));
// IMPORTANT: case-sensitive folder name "uploads", not "Uploads"
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Route Handlers ────────────────────────────────────────────────────────────
// Import and use route files that export express router directly
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/herobanners', require('./routes/herobannerRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/reviews', require('./routes/ReviewRoutes'));  // Ensure filename casing matches actual file
const usersRoutes = require("./routes/userRoutes");
app.use("/api/users", usersRoutes);

app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/uploads', require('./routes/uploadRoutes'));

// ─── Default Test Route ─────────────────────────────────────────────────────────
// Simple route to verify that server is running
app.get('/', (req, res) => {
  res.send('✅ Natraj Book Depot API running!');
});

// ─── MongoDB Connection & Server Start ──────────────────────────────────────────
// Connect to MongoDB (removed deprecated connection options to avoid warnings)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

/*
=== Notes:
1. Each route file (e.g., settingsRoutes.js, categoryRoutes.js) must export an Express router instance directly:
   module.exports = router;

2. Verify that filenames and directory casing exactly match the paths used in require() statements.

3. Restart the server after making any changes to route files or configuration.

*/
