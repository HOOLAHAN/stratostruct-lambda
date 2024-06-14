const Supplier = require('../models/supplierModel')
const mongoose = require('mongoose')

// get all suppliers
const getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find({}).sort({createdAt: -1})
  res.status(200).json(suppliers)
}

// get suppliers by product id
const getSuppliersByProductId = async (req, res) => {
  try {
    const productId = req.params.id // get the product id from the request parameter
    
    const suppliers = await Supplier.find({ "products._id": productId }); // find suppliers where the product id is in their products array

    res.status(200).json(suppliers); // send the suppliers array as the response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get a single supplier
const getSupplier = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such supplier'})
  }

  const supplier = await Supplier.findById(id)

  if (!supplier) {
    return res.status(404).json({error: 'No such supplier'})
  }

  res.status(200).json(supplier)
}

// create new supplier
const createSupplier = async (req, res) => {
  const { name, postcode, products } = req.body

  let emptyFields = []

  if(!name) {
    emptyFields.push('name')
  }
  if(!postcode) {
    emptyFields.push('postcode')
  }
  if(!products) {
    emptyFields.push('products')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
  }

  // Add doc to db
  try {
    const supplier = await Supplier.create({ name, postcode, products })
    res.status(200).json(supplier)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete a supplier
const deleteSupplier = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such supplier'})
  }

  const supplier = await Supplier.findOneAndDelete({_id: id})

  if (!supplier) {
    return res.status(404).json({error: 'No such supplier'})
  }

  res.status(200).json(supplier)

}

//update a supplier
const updateSupplier = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such supplier'})
  }

  const supplier = await Supplier.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!supplier) {
    return res.status(404).json({error: 'No such supplier'})
  }

  res.status(200).json(supplier)
}

// suppliersOfProducts function
const suppliersOfProducts = async (req, res) => {
  try {
      const productIds = req.body.productIds;

      if (!productIds || !Array.isArray(productIds)) {
          return res.status(400).json({ error: "Invalid input. Expecting an array of product IDs." });
      }

      // Log the received product IDs
      console.log("Received product IDs:", productIds);

      const suppliersForProducts = await Supplier.aggregate([
        { $unwind: "$products" },
        { $match: { "products._id": { $in: productIds } } },
        { $group: {
            _id: "$products._id",
            component_type: { $first: "$products.component_type" },
            component_name: { $first: "$products.component_name" },
            suppliers: { $push: { 
                _id: "$_id",
                name: "$name",
                postcode: "$postcode"
            }}
        }}
    ]);

      // Log the result of the aggregation
      console.log("Aggregation result:", suppliersForProducts);

      res.status(200).json(suppliersForProducts);
  } catch (error) {
      console.error("Error in suppliersOfProducts:", error);
      res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  deleteSupplier,
  updateSupplier,
  getSuppliersByProductId,
  suppliersOfProducts
}