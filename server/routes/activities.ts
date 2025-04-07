import express from 'express';
import { PrismaClient } from '@prisma/client';

const activityRouter = express.Router();
const prisma = new PrismaClient();

// POST
activityRouter.post('/', async (req: any, res: any) => {
  try {
<<<<<<< HEAD
    const newActivity = await prisma.activity.create(req.body)
    res.status(201).json(newActivity);

  } catch(error) {
    console.error('failed to make activity', error);
    res.sendStatus(500);
  }

})

// GET

activityRouter.get('/', async (req:any, res:any) => {
  try {
    const activitySet = await prisma.activity.findMany();
    res.status(200).send(activitySet);

  } catch(error) {
    console.error('unable to get activities', error);
    res.sendStatus(500);
  }
})

// DELETE

activityRouter.delete('/:id', async (req:any, res:any) => {
  const {id } = req.params;
  try {
    const killAct = await prisma.activity.delete({
      where: {
        id: Number(id),
      }});
    res.status(200).send(killAct);
  } catch(err) {
    console.error('could not delete Activity', err);
    res.sendStatus(500)
  }
})

activityRouter.patch('/:id', async (req: any, res: any) => {
  const {id } = req.params;
  const {name, description, time, date, location, image, phone, address} = req.body;
  console.log(req.body);
  try {
    const changeActivity = await prisma.activity.update({
      where: {id: Number(id)},
=======
    const { name, description, time, date, location, image, phone, address, itineraryId } = req.body;
    const newActivity = await prisma.activity.create({
>>>>>>> 640e0b53e4b3a2f35f26de2db6d15f53a1b2d061
      data: {
        name,
        description,
        time,
        date,
        location,
        image,
        phone,
        address,
        itineraryId: itineraryId,  
      },
      
    });
    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.sendStatus(500);
  }
});

// GET
//:itineraryId
activityRouter.get('/:itineraryId', async (req: any, res: any) => {
  try {
     const { itineraryId } = req.params;  
    const activities = await prisma.activity.findMany({
      where: {
        itineraryId: itineraryId ? Number(itineraryId) : undefined,  // If itineraryId is provided or undefined
      },
    });
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.sendStatus(500);
  }
});

// DELETE
activityRouter.delete('/:id', async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const deletedActivity = await prisma.activity.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(deletedActivity);
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.sendStatus(500);
  }
});

// PATCH (update)
activityRouter.patch('/:id', async (req: any, res: any) => {
  const { id } = req.params;
  const { name, description, time, date, location, image, phone, address, itineraryId } = req.body;
  try {
    const updatedActivity = await prisma.activity.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        time,
        date,
        location,
        image,
        phone,
        address,
       itineraryId: itineraryId ? Number(itineraryId) : undefined,  
      },
    });
    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error('Error updating activity:', error);
    res.sendStatus(500);
  }
});

// POST (add activity to a specific itinerary)
activityRouter.post('/:itineraryId/activity', async (req: any, res: any) => {
  try {
    const { itineraryId } = req.params;  
    const { name, description, time, date, location, image, phone, address } = req.body;

    // if (!itineraryId || !name || !description || !time || !date) {
    //   return res.status(400).json({ error: 'Missing required fields' });
    // }

    const newActivity = await prisma.activity.create({
      data: {
        name,
        description,
        time,
        date,
        location,
        image,
        phone,
        address,
        itineraryId: Number(itineraryId),  
      },
    });

    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.sendStatus(500);
  }
});


export default activityRouter;
