import express from 'express';
// import Users db model
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const usersRoute = express.Router()

// Example Requests
usersRoute.get('/', async (req: any, res:any) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json
({error: 'Error fetching users'})  }
}) 

/* route.post('/', (req: any, res:any) => {

}) */

/* route.patch]('/', (req: any, res:any) => {

}) */

/* route.delete]('/', (req: any, res:any) => {

}) */

// export the route for use in server/index.ts
export default  usersRoute;
