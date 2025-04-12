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
postsRouter.post('/', async (req:any, res:any) => {
  try {
    const newPost = await prisma.post.create(req.body);
    res.status(201).send('posted successfully');
  } catch (err) {
    console.error('unable to post', err);
    res.sendStatus(500);
  }
});




// DELETE Will take out a post and all its connected comments. Only the user that posted the post can remove it.
postsRouter.delete('/:postId/:userId', async (req: any, res: any) => {
  const { postId, userId } = req.params;
  try {
    const credentials = await prisma.post.findFirst({
      where: {
        id: +postId,
        userId: +userId,
      }
    })
    if (!credentials) {
      res.status(403).send('You cannot delete this post');
    } else {
      const killPost = await prisma.post.delete({
        where: {
          id: +postId,
        }
      })
      res.status(200).send('delete successful');
    }
  } catch (err) {console.error('unable to delete', err);}
});


export default postsRouter;