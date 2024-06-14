const express = require('express')
const {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
} = require('../controllers/productController')

const requireAuth = require('../middleware/requireAuth')
const isAdmin = require('../middleware/isAdmin')

const router = express.Router()

// require auth for all product routes
router.use(requireAuth)

// GET all products
router.get('/', getProducts)

// GET a single product
router.get('/:id', getProduct)

// POST a new product
router.post('/', isAdmin, createProduct);

// DELETE a product
router.delete('/:id', isAdmin, deleteProduct);

// UPDATE a product
router.patch('/:id', isAdmin, updateProduct);

module.exports = router;