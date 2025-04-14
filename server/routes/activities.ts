


import express from 'express';
import { PrismaClient } from '@prisma/client';

const activityRouter = express.Router();
const prisma = new PrismaClient();

// Helper: check if user is in party or is the itinerary creator
const hasActivityPermission = async (userId: number, itineraryId: number) => {
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

  return { allowed: isCreator || isInParty, isCreator };
};

// POST
activityRouter.post('/', async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    console.log('User ID:', userId); 

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

export default activityRouter;
