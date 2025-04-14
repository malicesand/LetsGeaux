import express from 'express';

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const imageRoute = express.Router()

imageRoute.post('/', async (req:any, res:any) => {
  const { url, notes } = req.body;
  const userId = req.user?.id; 
 

  if (!url || !userId) {
    return res.status(400).json({ error: 'Missing image URL or user ID' });
  }

  try {
    const newImage = await prisma.image.create({
      data: {
        url,
        notes,
        userId,
      },
    });

    res.status(201).json(newImage);
  } catch (err) {
    console.error('Error saving image:', err);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

imageRoute.get('/:userId', async (req, res) => {
  const {userId} = req.params
  try {
    const images = await prisma.image.findMany({
      where:{userId: +userId},
      orderBy: {
        id: 'desc', 
      },
    });

    res.status(200).json(images);
  } catch (error) {
    console.error(' Failed to fetch images:', error);
    res.status(500).json({ error: 'Something went wrong fetching images.' });
  }
});

imageRoute.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.image.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ success: true, deleted });
  } catch (err) {
    console.error('Failed to delete image:', err);
    res.status(500).json({ error: 'Could not delete image' });
  }
});



export default imageRoute