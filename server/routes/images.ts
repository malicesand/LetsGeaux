import express from 'express';
import cloudinary from '../cloudinary';
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const imageRoute = express.Router()

imageRoute.post('/', async (req: any, res: any) => {
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
  const { userId } = req.params
  try {
    const images = await prisma.image.findMany({
      where: { userId: +userId },
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

imageRoute.delete('/:imageId', async (req, res) => {
  const { imageId } = req.params;
  //console.log(`Looking up image with ID ${imageId}`);
  try {
    const image = await prisma.image.findUnique({
      where: { id: parseInt(imageId) },
    });


    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Extract Cloudinary public_id
    const publicId = getCloudinaryPublicId(image.url);

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete from database
    const deleted = await prisma.image.delete({
      where: { id: parseInt(imageId) },
    });

    res.status(200).json({ success: true, deleted });
  } catch (err) {
    console.error('Failed to delete image:', err);
    res.status(500).json({ error: 'Could not delete image' });
  }
});

// Helper: Extract public_id from full Cloudinary URL
function getCloudinaryPublicId(url: string) {
  const parts = url.split('/');
  const filename = parts.pop()?.split('.')[0]; // remove .jpg/.png
  const folder = parts.slice(parts.indexOf('upload') + 1).join('/');
  return `${folder}/${filename}`;
}
export default imageRoute