

import express from 'express';

import axios from 'axios'

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const mapsRoute = express.Router()

 
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

mapsRoute.post('/', async(req:any, res:any)=>{
  console.log(req.body.data)
  const { origin, destination, travelTime, user_id } = req.body.data;
console.log(origin, destination, travelTime)
  try {
    
    const routeInfo = await prisma.route.create({
      data: {
        origin,
        destination,
        travelTime,
        user_id
      },
    });

    // Send a success response
    res.status(200).json({
      message: 'Travel data saved successfully!',
      routeInfo,
    });
  } catch (error) {
    console.error('Error saving travel data:', error);
    res.status(500).json({
      message: 'Error saving travel data. Please try again later.',
    });
  }
})

export default mapsRoute;