import express from 'express';
import {Request, Response} from 'express'
//TODO: import { Prisma} from '@prisma'
 //TODO: import { Itinerary } from '../database/index'

const route = express.Router();

route.get('/', async (req: Request, res: Response )=>{
//const {} = req.params
try{
  //const itineraries = await Itinerary.find({})
res.status(200).json()
}catch(error){
res.status(500).json({error: 'Error fetching itinerary'})
}

})

route.post('/', async (req: Request, res: Response) =>{

}) 