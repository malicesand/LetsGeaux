import express from 'express'
import { PrismaClient } from '@prisma/client';

const activityRouter = express.Router();
const prisma = new PrismaClient;
// POST

activityRouter.post('/', async (req:any, res:any) => {

  try {
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
      data: {
        name, 
        description, 
        time, date,
        location,
        image,
        phone, 
        address,
      }
    })
    res.status(200).send(changeActivity)
  } catch(err) {
    console.error('unable to amend', err);
    res.sendStatus(500);
  }
})

export default activityRouter;
