require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supplierRoutes = require('./routes/suppliers');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/user');
const mapboxRoutes = require('./routes/mapbox');
const { connectToDatabase } = require('./db');

const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Enable CORS
app.use(cors());

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection failed', {
      message: error.message,
      code: error.code,
      hostname: error.hostname,
    });

    res.status(503).json({ error: 'Database connection unavailable' });
  }
});

// Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/mapbox', mapboxRoutes);

module.exports = app;
