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
  try {
    const {userId} = req.params

    const userInterests = await prisma.userInterest.findMany({
      where: { userId: +userId },
      include: {
        interest: true, // Include interest details
      },
    });

    // Extract just the interest data
    const interests = userInterests.map((ui) => ui.interest);

    res.status(200).json(interests);
  } catch (error) {
    console.error("Error fetching user interests:", error);
    res.status(500).json({ message: 'Error fetching interests' });
  }
});



export default interestRoute