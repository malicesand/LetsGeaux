const express = require('express');
import { PrismaClient } from '@prisma/client';

const postsRouter = express.Router();
const prisma = new PrismaClient;

// GET: called when a user enters, adds, or takes away from the feed. 
// Get calls ALL posts in reverse chrono order.. maybe top 10/20?

postsRouter.get('/', async (req:any, res:any) => {
try {
  const allPosts = await prisma.post.findMany();
  res.status(200).send(allPosts);
} catch (err){
  console.error('unable to get posts', err);
  res.sendStatus(500);
}
})


// POST must connect to the user(params). Happens when a form is submitted. Must add createdAt tag

// DELETE Will take out a post and all its connected comments. Only the user that posted the post can remove it.

export default postsRouter;