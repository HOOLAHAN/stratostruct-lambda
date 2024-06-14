const express = require('express')
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  deleteSupplier,
  updateSupplier,
  getSuppliersByProductId,
  suppliersOfProducts
} = require('../controllers/supplierController')

const requireAuth = require('../middleware/requireAuth')
const isAdmin = require('../middleware/isAdmin')

const router = express.Router()

// require auth for all supplier routes
router.use(requireAuth)

// GET all suppliers
router.get('/', getSuppliers);

// GET all suppliers of a product
router.get('/product/:id', getSuppliersByProductId);

// GET a single supplier
router.get('/:id', getSupplier);

// POST a new supplier
router.post('/', isAdmin, createSupplier);

// DELETE a supplier
router.delete('/:id', isAdmin, deleteSupplier);

// UPDATE a supplier
router.patch('/:id', isAdmin, updateSupplier);

// POST a list of product ids to get a list of suppliers
router.post('/suppliers-by-products', suppliersOfProducts);

module.exports = router;