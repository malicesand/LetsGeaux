import express from 'express'
import { PrismaClient } from '@prisma/client';

const activityRouter = express.Router();
const prisma = new PrismaClient;
// POST

activityRouter.post('/', async (req:any, res:any) => {

  try {
    console.log('under here')
    console.log(req.body);
    console.log('over here---------------------------------------------')
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

export default activityRouter;
