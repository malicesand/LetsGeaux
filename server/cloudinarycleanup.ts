import { CronJob } from 'cron';  
import cloudinary from './cloudinary';  
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cleanupUnusedCloudinaryImages = async () => {
  try {
    console.log('Running daily Cloudinary cleanup...');

    const usedImages = await prisma.image.findMany({
      select: { url: true },
    });

    const profilePics = await prisma.user.findMany({
      select: { profilePic: true },
    });

    
    
    const usedUrls = [
      ...usedImages.map((img) => img.url),
      ...profilePics.map((user) => user.profilePic),
    ];

    
    const cloudImages = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'letsGeaux/', 
      max_results: 500,
    });

    // Filter out unused images using includes instead of Set
    const unusedPublicIds = cloudImages.resources
      .filter((res) => !usedUrls.includes(res.secure_url))  
      .map((res) => res.public_id);

    if (unusedPublicIds.length === 0) {
      console.log('No unused images to delete.');
      return;
    }

    // Delete unused images from Cloudinary
    const deleteResult = await cloudinary.api.delete_resources(unusedPublicIds);
    console.log('Deleted unused images:', deleteResult);
  } catch (error) {
    console.error('Error cleaning up Cloudinary images:', error);
  }
};


cleanupUnusedCloudinaryImages();


const job = new CronJob('32 * * * *', async () => {
  await cleanupUnusedCloudinaryImages(); 
}, null, true, 'America/Chicago');

job.start();