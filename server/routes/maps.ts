

import express from 'express';

import axios from 'axios'

//prisma goes here

const mapsRoute = express.Router()

 // Distance Matrix API request handler (using addresses)
mapsRoute.get('/distance', async (req: any, res: any) => {
  const { address1, address2 } = req.query;

  // Validate addresses
  if (!address1 || !address2 || typeof address1 !== 'string' || typeof address2 !== 'string') {
    return res.status(400).json({ error: 'Both address1 and address2 query parameters are required.' });
  }

  try {
    // Create the URL for the Distance Matrix API using addresses
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(address1)}&destinations=${encodeURIComponent(address2)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    // Make the request to the Google Maps Distance Matrix API
    const response = await axios.get(url);

    // Handle the API response
    const result = response.data;

    // Check if the API request was successful
    if (result.status !== 'OK') {
      return res.status(500).json({ error: 'An error occurred while retrieving distance data.' });
    }

    // Get the travel time from the response
    const travelTime = result.rows[0].elements[0].duration;

    if (!travelTime) {
      return res.status(404).json({ error: 'Unable to calculate travel time between the provided addresses.' });
    }

    // Return the travel time between the two addresses
    // the default is driving
    res.json({
      from: address1,
      to: address2,
      travel_time: travelTime.text,  
     
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving distance data.' });
  }
});
mapsRoute.get('/directions', async (req:any, res:any) => {
  const { origin, destination } = req.query;

  // Validate parameters
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required.' });
  }

  try {
    // Use Google Maps Directions API
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin as string)}&destination=${encodeURIComponent(destination as string)}&key=${googleMapsApiKey}`;

    const response = await axios.get(url);

    // Check if the response contains routes
    const routes = response.data.routes;
    if (!routes || routes.length === 0) {
      return res.status(404).json({ error: 'No routes found.' });
    }

    // Extract the polyline from the first route
    const polyline = routes[0].overview_polyline?.points;

    if (!polyline) {
      return res.status(404).json({ error: 'No polyline found.' });
    }

    // Return the polyline for the frontend to render on the map
    res.json({ polyline });
  } catch (error) {
    console.error('Error fetching directions:', error);
    res.status(500).json({ error: 'An error occurred while fetching directions.' });
  }
});



export default mapsRoute;