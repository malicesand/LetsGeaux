import express from 'express';
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const interestRoute = express.Router()


interestRoute.post('/', async (req, res) => {
  try {
    const interests = req.body; // Array of interest objects

    // Use a for...of loop to handle async await correctly
    const createdInterests = [];
    
    for (const interest of interests) {
      const createdInterest = await prisma.interest.create({
        data: {
          name: interest.name, // assuming the interest has a "name" field
        },
      });
      createdInterests.push(createdInterest);
    }

    res.status(200).json(createdInterests); // Return the array of created interests
  } catch (error) {
    console.error("Error saving interests:", error);
    res.status(500).json({ message: 'Error saving interests' });
  }
});

interestRoute.get('/', async (req, res) => {
  try {
    // Fetch all interests from the database
    const interests = await prisma.interest.findMany();

    // Return the fetched interests in the response
    res.status(200).json(interests);
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({ message: 'Error fetching interests' });
  }
});



export default interestRoute