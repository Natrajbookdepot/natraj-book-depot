// backend/server.js

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
// Serve your logo and any other images placed in frontend/public/images
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// ─── Settings Route ─────────────────────────────────────────────────────────────
app.use('/api/settings', require('./routes/settingsRoutes'));

// ─── Default Test Route ────────────────────────────────────────────────────────
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
