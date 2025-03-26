import express from 'express';
//import {Request, Response} from 'express'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const itineraryRoute = express.Router();

itineraryRoute.get('/', async (req: any, res: any )=>{
//const {} = req.params
try{
  //const itineraries = await .find({})
res.status(200).json()
}catch(error){
res.status(500).json({error: 'Error fetching itinerary'})
}

})

itineraryRoute.post('/', async (req: any, res: any) =>{
//const {} = req.params
try{
  //const itineraries = await Itinerary.find({})
res.status(201).json()
}catch(error){
res.status(500).json({error: 'Error creating itinerary'})
}

}) 

itineraryRoute.patch('/:id  ', async (req: any, res: any )=>{
  // itineraryRoute.put('/', async (req: any, res: any )=>{

  //const {} = req.params
  try{
    //const itineraries = await Itinerary.find({})
  res.status(200).json()
  }catch(error){
  res.status(500).json({error: 'Error updating itinerary'})
  }
  
  })
  
  itineraryRoute.delete('/:id', async (req: any, res: any) =>{
  const {id } = req.params
  try{
    const deleteIntinerary = await prisma.itinerary.delete({
      where: {
        id: 1
      }
    })
    console.log(deleteIntinerary)
  res.status(200).json({message: `Itinerary ${id} has been successfully deleted`})
  }catch(error){
  res.status(500).json({error: 'Error deleting itinerary'})
  }
  
  }) 







export default itineraryRoute;