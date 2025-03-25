import express from 'express';
import {Request, Response} from 'express'
//TODO: import { Itenarary } from ''

const route = express.Router();

route.get('/', async (req: any ,res: any )=>{

try{

}catch(error){
res.status(500).json({error: 'Error fetching itinerary'})
}

})

