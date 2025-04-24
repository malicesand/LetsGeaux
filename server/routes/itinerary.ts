

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const itineraryRoute = express.Router();

//GET all itineraries for the logged-in user (creator)
itineraryRoute.get('/', async (req: any, res: any) => {
  const userId = req.user.id;

  try {
    // Find partyIds the user is in
    const userParties = await prisma.userParty.findMany({
      where: { userId },
      select: { partyId: true },
    });

    const partyIds = userParties.map(p => p.partyId);

    // Fetch itineraries created by user OR attached to a party the user is in
    const itineraries = await prisma.itinerary.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { party: { id: { in: partyIds } } },
        ],
      },
    });
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching itineraries' });
  }
});


// POST create a new itinerary
itineraryRoute.post('/', async (req: any, res: any) => {
  const { creatorId, name, notes, begin, end, upVotes, downVotes, partyId } = req.body;

  // Check if the user exists
  const userExists = await prisma.user.findUnique({
    where: { id: creatorId },
  });

  if (!userExists) {
    return res.status(400).json({ error: 'Creator not found' });
  }

  // Ensure required fields are provided
  if (!name || !begin || !end) {
    return res.status(400).json({ error: 'Missing required fields: name, begin, end' });
  }

  // Parse and validate dates
  const startDate = new Date(begin);
  const endDate = new Date(end);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Generate a random 4-character view code
  const viewCode = uuidv4().slice(0, 4);

  try {
    // Create the new itinerary with required properties
    const newItinerary = await prisma.itinerary.create({
      data: {
        creatorId,
        name,
        notes: notes ?? '',
        begin: startDate,
        end: endDate,
        upVotes: upVotes ?? 0, 
        downVotes: downVotes ?? 0, 
        createdAt: new Date(), 
        viewCode, // 
        partyId: partyId ? Number(partyId) : null
      },
    });

    // update party to new itinerary
if (partyId) {
  await prisma.party.update({
    where: { id: Number(partyId) },
    data: {
      itineraryId: newItinerary.id, 
    },
  });
}

    res.status(201).json(newItinerary);
    
  } catch (error: any) {
    // Handle unexpected errors
    console.error('Error creating itinerary:', error);
    res.status(500).json({ error: 'Error creating itinerary', details: error.message });
  }
});

// PATCH update itinerary (creator or party member)
itineraryRoute.patch('/:id', async (req: any, res: any) => {
  const { id } = req.params;
  const { name, notes, begin, end, upVotes, downVotes } = req.body;

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: Number(id) },
    });

    if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });

    const userId = req.user.id;


   let isInParty = false;
    if (itinerary.partyId) {
      const userParty = await prisma.userParty.findFirst({
        where: {
          userId,
          partyId: itinerary.partyId,
        },
      });
      isInParty = !!userParty;
    }

    const isCreator = itinerary.creatorId === userId;

    if (!isCreator && !isInParty) {
      return res.status(403).json({ error: 'You are not authorized to update this itinerary' });
    }

    const updatedItinerary = await prisma.itinerary.update({
      where: { id: Number(id) },
      data: {
        name,
        notes,
        begin: new Date(begin),
        end: new Date(end),
        upVotes,
        downVotes,
      },
    });

    res.status(200).json(updatedItinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({ error: 'Error updating itinerary' });
  }
});

// DELETE itinerary (only by creator)
itineraryRoute.delete('/:id', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: Number(id) },
    });

    if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });

    if (itinerary.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this itinerary' });
    }

    const deletedItinerary = await prisma.itinerary.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: `Itinerary ${id} has been successfully deleted`,
      deletedItinerary,
    });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({ error: 'Error deleting itinerary' });
  }
});

// GET itinerary by view code (public view)
itineraryRoute.get('/view/:viewCode', async (req: any, res: any) => {
  const { viewCode } = req.params;

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { viewCode },
      include: {
        activity: true,
        route: true,
        creator: { select: { id: true } },
        party: {
          select: {
            name: true, 
          },
        },
      },
    });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    res.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//* Fetch the Party's Itinerary *//
itineraryRoute.get('/party/:partyId', async (req: any, res: any) => {
  const { partyId } = req.params;

  try {
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        partyId: Number(partyId),
      },
      select: {
        id: true,
        name: true,
        viewCode: true,
        begin: true,
        end: true,
        creatorId: true,
      },
    });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found for this party' });
    }

    res.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary by partyId:', error);
    res.status(500).json({ error: 'Failed to fetch itinerary by partyId' });
  }
});


export default itineraryRoute;
