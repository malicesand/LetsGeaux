


import express, { response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const activityRouter = express.Router();
const prisma = new PrismaClient();

// fetch google places 
activityRouter.get('/google-place-autocomplete', async (req:any, res:any) => {
  //destructure input 
  const { input } = req.query;
//check if there is an input
  if (!input) {
    return res.status(400).json({ error: 'Missing input' });
  }

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    //specifically for new orleans places with strict bounds
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input as string
    )}&location=29.9511,-90.0715&radius=30000&strictbounds=true&key=${apiKey}`;
    //et request with axios
    const response = await axios.get(url);
    //checks for api errors
    if (response.data.status !== 'OK') {
      return res.status(400).json({ error: response.data.error_message || 'Google API error' });
    }
// ok status with response to be an array of description objects
    res.status(200).json({ predictions: response.data.predictions });
  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json({ error: 'An error  fetching autocomplete suggestions.' });
  }
});

//fetch google details 
activityRouter.get('/google-place-details', async (req:any, res:any) => {
  const { placeId } = req.query;

  if (!placeId) {
    return res.status(400).json({ error: 'Missing placeId query parameter.' });
  }

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId as string)}&fields=name,formatted_address,formatted_phone_number,photos&key=${apiKey}`;


    const response = await axios.get(url);

    if (response.data.status !== 'OK') {
      return res.status(400).json({ error: response.data.error_message || 'Google API error' });
    }

    res.json(response.data.result);
    if (!response.data.result) {
      return res.status(500).json({ error: 'Invalid response from Google.' });
    }
    
  } catch (error) {
    console.error('Place details error:', error);
    res.status(500).json({ error: 'An error occurred while fetching place details.' });
  }
});
activityRouter.get('/google-place-photo', async (req: any, res: any) => {
  const { photoRef } = req.query;

  if (!photoRef) {
    return res.status(400).json({ error: 'Missing photoRef query parameter.' });
  }

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${encodeURIComponent(photoRef)}&key=${apiKey}`;

const imageResponse = await axios.get(url, { responseType: 'stream' });
res.setHeader('Content-Type', imageResponse.headers['content-type']);
imageResponse.data.pipe(res);
  } catch (error) {
    console.error('Photo fetch error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the photo.' });
  }
});

//fetch descriptions
activityRouter.get('/autocomplete-descriptions', async (req, res) => {
  try {
    const descSuggestions = [
  'Enjoy local food and drinks',
  'Listen to live music performances',
  'Visit a historical museum',
  'Go kayaking in scenic waters',
  'Explore shops and boutiques',
  'Experience the nightlife scene',
  'Attend an art exhibit or gallery show',
  'Relax and enjoy the spa',
  'Join a local festival or event',
  'Browse the farmer’s market',
  'Savor a wine tasting experience',
  'Discover local street performers',
  'Have a picnic in the park',
  'Watch a parade or celebration',
  'Enjoy a sunset cruise',
  "Sightseeing across the city and historic areas"
    ];

    const descriptions = await prisma.activity.findMany({
      //only fetch description from activity 
      select: { description: true },
      // removes duplicates descriptions( only unique values)
      distinct: ['description'],
      // limits description to30 unique values 
      take: 30
    });

    const list = descriptions.map(d => d.description).filter(Boolean);

    // Combine and remove duplicates
    const allSuggestions = Array.from(new Set([...descSuggestions, ...list]));

    res.json(allSuggestions);
  } catch (error) {
    console.error('Error fetching descriptions:', error);
    res.status(500).json({ error: 'Failed to fetch autocomplete descriptions' });
  }
});

//fetch names 
activityRouter.get('/autocomplete-names', async (req, res) => {
  try {
    const nameSuggestions = [
      'City Tour',
      'Jazz Club',
      'Brunch',
      'Biking',
      'Wine Tasting',
      'Beach Day',
      'Parade',
      'Local Market,',
      'Dinner',
      'Lunch', 
      'Festival',
      'Conference',
      'Kayaking',
      'Shopping',
      'Bars',
      'Live music',
      'Museum visit',
      'Nightlife',
      'Art exhibit',
      'Parks', 
      'Spa Day'   
    ];

    const names = await prisma.activity.findMany({
      select: { name: true },
      distinct: ['name'],
      take: 30
    });

    const list = names.map(d => d.name).filter(Boolean);
    // new Set will remove duplicates in the two arrays
    //Array.from will convert Set back into normal array
    const allSuggestions = Array.from(new Set([...nameSuggestions, ...list]));

    res.json(allSuggestions);
  } catch (error) {
    console.error('Error fetching names:', error);
    res.status(500).json({ error: 'Failed to fetch autocomplete names' });
  }
});



// Helper: check if user is in party or is the itinerary creator
const hasActivityPermission = async (userId: number, itineraryId: number) => {
  // console.log(`userId @ has permission ${userId}`)
  const itinerary = await prisma.itinerary.findUnique({
    where: { id: itineraryId },
    include: {
      party: {
        include: {
          userParty: {
            where: { userId },
          },
        },
      },
    },
  });
  if (!itinerary) return { allowed: false };

  const isCreator = itinerary.creatorId === userId;
  const isInParty = (itinerary.party?.userParty?.length ?? 0) > 0;
  // console.log(`@ permission: is creator ${isCreator} is in party ${isInParty}`)
  return { allowed: isCreator || isInParty, isCreator };
};

// POST
activityRouter.post('/', async (req: any, res: any) => {
  // console.log(req.user.id)
  try {
    // console.log(req.user.id)
    const userId = req.user.id;
    const { itineraryId, name, description, time, date, location, image, phone, address } = req.body;
    
    // Check if required fields are present
    if (!itineraryId || !name || !description || !time || !date || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check permissions
    const { allowed } = await hasActivityPermission(userId, itineraryId);
    if (!allowed) {
      
      console.log(`User ${userId} not authorized for itinerary ${itineraryId}`);
      return res.status(403).json({ error: 'Not authorized to add activity' });
    }

    // Create activity
    const newActivity = await prisma.activity.create({
      data: { itineraryId, name, description, time, date, location, image, phone, address }
    });

    res.status(201).json(newActivity);

  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});




// DELETE
activityRouter.delete('/:id', async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const activity = await prisma.activity.findUnique({
      where: { id: Number(id) },
      include: { itinerary: true },
    });

    if (!activity || !activity.itinerary) return res.sendStatus(404);

    if (activity.itinerary.creatorId !== userId) {
      return res.status(403).json({ error: 'Only the creator can delete this activity.' });
    }

    const deleted = await prisma.activity.delete({ where: { id: Number(id) } });
    res.json(deleted);
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.sendStatus(500);
  }
});

// PATCH
activityRouter.patch('/:id', async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const activity = await prisma.activity.findUnique({
      where: { id: Number(id) },
      include: { itinerary: { include: { party: { include: { userParty: true } } } } },
    });

    if (!activity || !activity.itinerary) return res.sendStatus(404);

    const isCreator = activity.itinerary.creatorId === userId;
    const isInParty = activity.itinerary.party?.userParty.some(up => up.userId === userId);

    if (!isCreator && !isInParty) {
      return res.status(403).json({ error: 'Not authorized to update this activity.' });
    }

    const updated = await prisma.activity.update({
      where: { id: Number(id) },
      data: { ...req.body },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating activity:', error);
    res.sendStatus(500);
  }
});

// GET
activityRouter.get('/:itineraryId', async (req: any, res: any) => {
  try {
    const { itineraryId } = req.params;
    const activities = await prisma.activity.findMany({
      where: { itineraryId: Number(itineraryId) },
    });
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.sendStatus(500);
  }
});


export default activityRouter;
