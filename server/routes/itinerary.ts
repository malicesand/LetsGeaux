import express from 'express';
import {Request, Response} from 'express'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const itineraryRoute = express.Router();

itineraryRoute.get('/', async (req: Request, res: Response )=>{
try{
  const itineraries = await prisma.itinerary.findMany()
res.status(200).json(itineraries)
}catch(error){
res.status(500).json({error: 'Error fetching itinerary'})
}

})

itineraryRoute.post('/', async (req: Request, res: Response) =>{
const {creator_id, member_id, name, notes, begin, end, upVotes, downVotes} = req.body
try{
  const newItinerary = await prisma.itinerary.create({
data: {
creator_id, 
member_id, 
name, 
notes, 
begin: new Date(begin),
end: new Date(end),
upVotes,
downVotes,
createdAt: new Date()
}

  })
res.status(201).json(newItinerary)
}catch(error){
res.status(500).json({error: 'Error creating itinerary'})
}

}) 

itineraryRoute.patch('/:id  ', async (req: Request, res: Response )=>{
  const {id } = req.params;
  const {name, notes, begin, end, upVotes, downVotes} = req.body
 
  try{
    const updateItinerary = await prisma.itinerary.update({
      where: {id: Number(id)},
      data: {
        name, 
        notes, 
        begin: new Date(begin),
        end: new Date(end),
        upVotes, 
        downVotes
      }
    })
  res.status(200).json(updateItinerary)
  }catch(error){
  res.status(500).json({error: 'Error updating itinerary'})
  }
  
  })
  
  itineraryRoute.delete('/:id', async (req: Request, res: Response) =>{
  const {id } = req.params
  try{
    const deleteIntinerary = await prisma.itinerary.delete({
      where: {
        id: Number(id)
      }
    })
    console.log(deleteIntinerary)
  res.status(200).json({message: `Itinerary ${id} has been successfully deleted`, deleteIntinerary})
  }catch(error){
  res.status(500).json({error: 'Error deleting itinerary'})
  }
  
  }) 







export default itineraryRoute;