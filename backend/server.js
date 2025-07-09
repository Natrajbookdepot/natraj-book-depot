const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

// Init app
const app = express();
app.use(cors());
app.use(express.json());

// Default test route
app.get('/', (req, res) => {
  res.send('✅ Natraj Book Depot API running!');
});

// MongoDB connect
//console.log('ENV MONGODB_URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)

.then(() => {
  console.log('✅ MongoDB Connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
// Looking at your `backend/server.js` file, I can see it's a basic Express server setup with MongoDB connection. The code appears to be structurally correct, but I notice a few potential improvements and best practices that could be added:
