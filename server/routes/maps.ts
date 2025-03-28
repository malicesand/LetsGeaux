

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
 
  const { origin, destination, travelTime} = req.body;

  try {
    
    const routeInfo = await prisma.route.create({
      data: {
        origin,
        destination,
        travelTime,
      },
    });

    // Send a success response
    res.status(201).json({
      message: 'Travel info saved successfully!',
      routeInfo,
    });
  } catch (error) {
    console.error('Error saving travel info:', error);
    res.status(500).json({
      message: 'Error saving travel info. Please try again later.',
    });
  }
})
mapsRoute.get('/',async (req:any, res:any)=>{
  try{
const routeGet = await prisma.route.findMany()
console.log('Travel info ')
res.status(200).send(routeGet)
  }
  catch(error){
console.error('error geting information about your route', error)
  }
})


export default mapsRoute;