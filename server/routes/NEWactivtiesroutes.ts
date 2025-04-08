import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
const activityRouter = express.Router();
const prisma = new PrismaClient();

//POST 
activityRouter.post('/', async(req: any, res: any) =>{
try{
const{} = req.body
  res.status(201).json()
}catch(errorr){

}
})

//GET

//UPDATE


//DELETE