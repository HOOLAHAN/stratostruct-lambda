require('dotenv').config()
const axios = require('axios');

// get driving distance between two postcodes
const getDistance = async (req, res) => {
  try {
    const { postcode1, postcode2 } = req.query;

    // get the latitude and longitude coordinates for each postcode
    const geocodingUrl1 = `https://api.mapbox.com/geocoding/v5/mapbox.places/${postcode1}.json?access_token=${process.env.MAPBOX_API_KEY}`;
    const geocodingUrl2 = `https://api.mapbox.com/geocoding/v5/mapbox.places/${postcode2}.json?access_token=${process.env.MAPBOX_API_KEY}`;

    const [data1, data2] = await Promise.all([
      axios.get(geocodingUrl1).then(response => response.data),
      axios.get(geocodingUrl2).then(response => response.data)
    ]);

    const coordinates1 = data1.features[0].center;
    const coordinates2 = data2.features[0].center;

    // calculate the driving distance between the two points
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates1[0]},${coordinates1[1]};${coordinates2[0]},${coordinates2[1]}?access_token=${process.env.MAPBOX_API_KEY}`;

    const drivingDistanceData = await axios.get(url);
    const distanceInMeters = drivingDistanceData.data.routes[0].distance;
    const distanceInKilometers = Math.round(distanceInMeters / 1000);

    res.json({ distance: distanceInKilometers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// function to fetch the driving route
const getRoute = async (req, res) => {
  try {
    const { startPostcode, endPostcode } = req.body;

    // Convert postcodes to geocoordinates using Mapbox Geocoding API
    const geoCodeUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    const startGeo = await axios.get(`${geoCodeUrl}${encodeURIComponent(startPostcode)}.json?access_token=${process.env.MAPBOX_API_KEY}`);
    const endGeo = await axios.get(`${geoCodeUrl}${encodeURIComponent(endPostcode)}.json?access_token=${process.env.MAPBOX_API_KEY}`);

    const startCoordinates = startGeo.data.features[0].center;
    const endCoordinates = endGeo.data.features[0].center;

    // Fetch route from Mapbox Directions API
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates[0]},${startCoordinates[1]};${endCoordinates[0]},${endCoordinates[1]}?geometries=geojson&access_token=${process.env.MAPBOX_API_KEY}`;
    const routeResponse = await axios.get(directionsUrl);
    const routeData = routeResponse.data.routes[0].geometry;

    // Send back only the necessary data to the front end
    res.json({ routeData });
  } catch (error) {
    console.error('Error getting route: ', error);
    res.status(500).send('Error getting route');
  }
};

const getMapTiles = async (req, res) => {
  try {
    const tileUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/${req.params.z}/${req.params.x}/${req.params.y}?access_token=${process.env.MAPBOX_API_KEY}`;
    const response = await axios.get(tileUrl, { responseType: 'arraybuffer' });
    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching map tiles');
  }
};

// Function to fetch coordinates from a postcode
const getCoordinatesFromPostcode = async (req, res) => {
  try {
    const { postcode } = req.query;
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(postcode)}.json?access_token=${process.env.MAPBOX_API_KEY}`;

    const response = await axios.get(geocodingUrl);
    const coordinates = response.data.features[0].center;

    res.json({ coordinates });
  } catch (error) {
    console.error('Error getting coordinates: ', error);
    res.status(500).send('Error getting coordinates');
  }
};

module.exports = {
  getDistance,
  getRoute,
  getMapTiles,
  getCoordinatesFromPostcode
}