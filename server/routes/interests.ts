import express from 'express';
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const interestRoute = express.Router()


interestRoute.post('/:userId', async (req, res) => {
  try {
    const interests = req.body; // Array of interest objects
    const {userId} = req.params
    console.log(req.body)
    // Use a for...of loop to handle async await correctly
    const createdInterests = [];
    for (const interest of interests) {
      // Check if the interest already exists (optional)
      let existingInterest = await prisma.interest.findFirst({
        where: { name: interest.name },
      });
      console.log(existingInterest)
      // If it doesn't exist, create it
      if (!existingInterest) {
        existingInterest = await prisma.interest.create({
          data: { name: interest.name },
        });
      }
      // Create the join in userInterest table
      await prisma.userInterest.create({
        data: {
          userId: +userId,
          interestId: existingInterest.id,
        },
      });

      createdInterests.push(existingInterest);
    }

    res.status(200).json(createdInterests);
  } catch (error) {
    console.error("Error saving interests:", error);
    res.status(500).json({ message: 'Error saving interests' });
  }
});

interestRoute.get('/:userId', async (req, res) => {
  const {userId} = req.params
  try {
    // Fetch all interests from the database
    const interests = await prisma.userInterest.findFirst({select:userId});
    console.log(interests)
  
    res.status(200).json(interests);
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({ message: 'Error fetching interests' });
  }
});



export default interestRoute