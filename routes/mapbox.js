const express = require('express')
const {
  getDistance,
  getRoute,
  getMapTiles,
  getCoordinatesFromPostcode
} = require('../controllers/mapboxController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all product routes
router.use(requireAuth)

// GET distance from mapbox API
router.get('/getDistance', getDistance)

// POST route from mapbox API
router.post('/getRoute', getRoute)

// GET map tiles
router.get('/styles/v1/mapbox/streets-v11/tiles/256/:z/:x/:y', getMapTiles);

// GET coordinates from postcode
router.get('/getCoordinates', getCoordinatesFromPostcode);


module.exports = router;