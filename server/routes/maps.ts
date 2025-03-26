

import express from 'express';

import axios from 'axios'
//prisma goes here

const mapsRoute = express.Router()
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

 interface GeocodeResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}
 mapsRoute.get('/geocode', async (req: any, res: any) => {
  const { address } = req.query;
  console.log(address)
  
  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Address query parameter is required.' });
  }

  try {
    // Make request to Google Maps Geocoding API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const response = await axios.get(url);
console.log("helo wold")
    // Handle Google Maps API response
    const geocodeData: GeocodeResult[] = response.data.results;

    if (geocodeData.length === 0) {
      return res.status(404).json({ error: 'No results found for the provided address.' });
    }

    // Return formatted address and location (latitude, longitude)
    const result = geocodeData[0];
    console.log(result)
    res.json({
      formatted_address: result.formatted_address,
      location: result.geometry.location,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving geocode data.' });
  }
});


export default  mapsRoute;