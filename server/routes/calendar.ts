import express from 'express';
import {Request, Response} from 'express'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const calendarRoute = express.Router();
//GET
calendarRoute.get('/', async (req: Request, res: Response )=>{
  try{
    
  res.status(200).json()
  }catch(error){
  res.status(500).json({error: 'Error fetching calendar'})
  }
  
  })
  

//POST
calendarRoute.post('/', async (req: any, res: any )=>{
  const {creatorId, date} = req.body
  try{
  //   const newCalendarDate = await prisma.calendarDate.create({
  //     data: {
  //       creatorId,
  //       date: new Date(date),
  //     }
  //   })
  // res.status(201).json(newCalendarDate)
  }catch(error){
  res.status(500).json({error: 'Error creating new date'})
  }
  
  })
  

//PATCH
calendarRoute.patch('/:id', async (req: any, res: any )=>{
  //const {} = req.params
  try{
    //const itineraries = await .find({})
  res.status(200).json()
  }catch(error){
  res.status(500).json({error: 'Error fetching itinerary'})
  }
  
  })
  



//DELETE

calendarRoute.delete('/:id', async (req: Request, res: Response )=>{
  const {id} = req.params
  try{
    //const deleteAct= await .find({})
  res.status(200).json()
  }catch(error){
  res.status(500).json({error: 'Error fetching itinerary'})
  }
  
  })
  







export default calendarRoute;
