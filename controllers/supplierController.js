const Supplier = require('../models/supplierModel')
const mongoose = require('mongoose')
const axios = require('axios')

const mapboxBaseUrl = 'https://api.mapbox.com';

const getPostcodeCoordinates = async (postcode) => {
  const response = await axios.get(`${mapboxBaseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(postcode)}.json`, {
    params: { access_token: process.env.MAPBOX_API_KEY },
  });

  const coordinates = response.data?.features?.[0]?.center;
  if (!coordinates) {
    throw new Error(`Could not geocode postcode ${postcode}`);
  }

  return coordinates;
};

const getDrivingSummary = async (startCoordinates, endCoordinates) => {
  const response = await axios.get(
    `${mapboxBaseUrl}/directions/v5/mapbox/driving/${startCoordinates[0]},${startCoordinates[1]};${endCoordinates[0]},${endCoordinates[1]}`,
    {
      params: {
        geometries: 'geojson',
        overview: 'simplified',
        access_token: process.env.MAPBOX_API_KEY,
      },
    }
  );

  const route = response.data?.routes?.[0];
  if (!route) {
    throw new Error('Could not calculate route');
  }

  return {
    distanceKilometers: Math.round(route.distance / 100) / 10,
    durationMinutes: Math.round(route.duration / 60),
  };
};

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
  }, { new: true })

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

      res.status(200).json(suppliersForProducts);
  } catch (error) {
      console.error("Error in suppliersOfProducts:", error);
      res.status(500).json({ message: error.message });
  }
};

const searchSuppliers = async (req, res) => {
  try {
    const { sitePostcode, productIds } = req.body;

    if (!sitePostcode || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'sitePostcode and productIds are required' });
    }

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

    const siteCoordinates = await getPostcodeCoordinates(sitePostcode);
    const supplierMap = new Map();

    suppliersForProducts.forEach((product) => {
      product.suppliers.forEach((supplier) => {
        const supplierId = supplier._id.toString();
        const existing = supplierMap.get(supplierId) || {
          ...supplier,
          products: [],
        };

        existing.products.push({
          _id: product._id,
          component_type: product.component_type,
          component_name: product.component_name,
        });
        supplierMap.set(supplierId, existing);
      });
    });

    const suppliers = await Promise.all(Array.from(supplierMap.values()).map(async (supplier) => {
      try {
        const coordinates = await getPostcodeCoordinates(supplier.postcode);
        const route = await getDrivingSummary(siteCoordinates, coordinates);

        return {
          ...supplier,
          coordinates,
          matchCount: supplier.products.length,
          ...route,
        };
      } catch (error) {
        return {
          ...supplier,
          coordinates: null,
          matchCount: supplier.products.length,
          distanceKilometers: null,
          durationMinutes: null,
          routeError: error.message,
        };
      }
    }));

    const supplierById = new Map(suppliers.map((supplier) => [supplier._id.toString(), supplier]));
    const products = suppliersForProducts.map((product) => ({
      ...product,
      suppliers: product.suppliers
        .map((supplier) => supplierById.get(supplier._id.toString()))
        .filter(Boolean)
        .sort((a, b) => (a.distanceKilometers ?? Infinity) - (b.distanceKilometers ?? Infinity)),
    }));

    res.status(200).json({
      site: {
        postcode: sitePostcode,
        coordinates: siteCoordinates,
      },
      products,
      suppliers: suppliers.sort((a, b) => {
        if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
        return (a.distanceKilometers ?? Infinity) - (b.distanceKilometers ?? Infinity);
      }),
    });
  } catch (error) {
    console.error("Error in searchSuppliers:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  deleteSupplier,
  updateSupplier,
  getSuppliersByProductId,
  suppliersOfProducts,
  searchSuppliers
}
