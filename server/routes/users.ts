import express from 'express';
// import Users db model
// ? import { Users } from '..database/index.ts' 
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// create a new user manually
router.post('/', async (req, res) => {
  const { username, email, googleId } = req.body;

  if (!username || !email || !googleId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        isVerified: true,
        isNotified: false,
        googleId //use value from body
      }
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('CREATE USER FAIL:', error);
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});

export default router;
// const route = express.Router()

// Example Requests
/* route.get('/', (req: any, res:any) => {
  
}) */

/* route.post('/', (req: any, res:any) => {

}) */

/* route.patch]('/', (req: any, res:any) => {

}) */

/* route.delete]('/', (req: any, res:any) => {

}) */

// // export the route for use in server/index.ts
// export default  route;
