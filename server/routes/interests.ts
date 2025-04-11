import express from 'express';
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const interestRoute = express.Router()


interestRoute.post('/:userId', async (req, res) => {
  console.log(req.body)
  try {
    const { name } = req.body 
    const { userId } = req.params;
    // Find or create the interest
    let interest = await prisma.interest.findFirst({
      where: { name },
    });

    if (!interest) {
      interest = await prisma.interest.create({
        data: { name },
      });
    }

    // Check if the userInterest already exists
    const existingUserInterest = await prisma.userInterest.findFirst({
      where: {
        userId: +userId,
      },
    });

    if (!existingUserInterest) {
      await prisma.userInterest.create({
        data: {
          userId: +userId,
          interestId: interest.id,
        },
      });
    }

    res.status(200).json(interest);
  } catch (error) {
    console.error("Error saving interest:", error);
    res.status(500).json({ message: 'Error saving interest' });
  }
});

interestRoute.get('/:userId', async (req, res) => {
  try {
    const {userId} = req.params

    const userInterests = await prisma.userInterest.findMany({
      where: { userId: +userId },
      include: {
        interest: true, 
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