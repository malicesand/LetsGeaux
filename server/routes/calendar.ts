import express from 'express';
//import {Request, Response} from 'express'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const calendarRoute = express.Router();
//GET
calendarRoute.get('/', async (req: any, res: any )=>{
  //const {} = req.params
  try{
    //const  = await .find({})
  res.status(200).json()
  }catch(error){
  res.status(500).json({error: 'Error fetching calendar'})
  }
  
  })
  

//POST
calendarRoute.get('/', async (req: any, res: any )=>{
  //const {} = req.params
  try{
    //const itineraries = await .find({})
  res.status(201).json()
  }catch(error){
  res.status(500).json({error: 'Error fetching itinerary'})
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

calendarRoute.delete('/;id', async (req: any, res: any )=>{
  //const {} = req.params
  try{
    //const itineraries = await .find({})
  res.status(200).json()
  }catch(error){
  res.status(500).json({error: 'Error fetching itinerary'})
  }
  
  })
  







export default calendarRoute;
