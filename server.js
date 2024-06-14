require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const supplierRoutes = require('./routes/suppliers');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/user');
const mapboxRoutes = require('./routes/mapbox');

const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Enable CORS
app.use(cors());

// Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/mapbox', mapboxRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to DB'))
  .catch((error) => console.log(error));

module.exports = app;
