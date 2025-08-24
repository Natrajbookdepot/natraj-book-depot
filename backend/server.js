const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// ─── Static Assets ─────────────────────────────────────────────────────────────
// Serve images from frontend/public/images/ and backend/uploads/ directories
app.use('/category', express.static(path.join(__dirname, '../frontend/public/category')));
// WRONG (case error):
// app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
// RIGHT:
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Settings Route ─────────────────────────────────────────────────────────────
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/herobanners', require('./routes/herobannerRoutes'));

// ─── Category Route ─────────────────────────────────────────────────────────────
app.use('/api/categories', require('./routes/categoryRoutes'));

// ─── Product Route ─────────────────────────────────────────────────────────────
app.use('/api/products', require('./routes/productRoutes'));

// ─── Review Route ─────────────────────────────────────────────────────────────
app.use('/api/reviews', require('./routes/ReviewRoutes')); // ADD THIS LINE

// ─── Default Test Route ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('✅ Natraj Book Depot API running!');
});

// ─── MongoDB Connection & Server Start ──────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
