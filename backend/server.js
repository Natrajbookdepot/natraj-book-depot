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
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Settings Route ─────────────────────────────────────────────────────────────
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/herobanners', require('./routes/herobannerRoutes'));

// ─── Category Route ─────────────────────────────────────────────────────────────
app.use('/api/categories', require('./routes/categoryRoutes')); // ADD THIS LINE

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
