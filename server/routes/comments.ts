const express = require('express')
import { PrismaClient } from '@prisma/client';

const commentsRouter = express.Router();
const prisma = new PrismaClient;


// GET: called when the 'make a comment' section is clicked. Pulls all comments that share a comment id
// (or post id, for the original thread) with the thread. shows top to bottom chrono.
// Will most of the time be called from post component, but should be passed down to comment component.

commentsRouter.get(/*Id from the post*/'/:id', async (req: any, res: any) => {
  const { id } = req.params;
  try {

    const allComments = await prisma.comment.findMany({
      where: {
        postId: +id,
      }
    })
    res.status(200).send(allComments.reverse())
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  });

  // get request specifically for checking whether or not this user is allowed to edit this comment
  commentsRouter.get(`/:id/:userId`, async (req: any, res: any) => {
    const { id, userId } = req.params;
    try {
      const credentials = await prisma.comment.findFirst({
        where: {
          id: +id,
          userId: +userId,
        },
      });
      if (credentials) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    } catch (err) {
      console.error('failed to check credentials', err);
      res.sendStatus(500);
    }
  });
// POST: Comment must connect to the Post or comment[so these need a postId&&commentId]
// Also must connect with the user that sent the comment

commentsRouter.post('/', async (req: any, res: any) => {
try {

  const newComment = await prisma.comment.create(req.body)
  res.status(201).send('posted!');
} catch (err) {
  console.error('unable to post comment', err);
  res.sendStatus(500);
}
})

// PATCH to add/remove numbers from likes count:
commentsRouter.patch('/likes/:id', async (req:any, res:any) => {
  const { id } = req.params;
  const { direction } = req.body.data;
  let addNum;
  if (direction === "up") {
    addNum = 1;
  } else {
    addNum = -1;
  }
  try {
    const setLikes = await prisma.comment.update({
      where: {
        id: +id,
      },
      data: {
        likes: {
          increment: addNum,
        },
      },
    });
  } catch (err) {
    console.error("unable to change likes", err);
    res.sendStatus(500);
  }
});

// genuine patch function to change the body of a comment
commentsRouter.patch("/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const { body } = req.body;
  try {
    const newPost = await prisma.comment.update({
      where: {
        id: +id
      },
      data: {
        body,
      },
    });
    res.sendStatus(200);
  } catch (err) {
    console.error("failed to change comment", err);
    res.sendStatus(500);
  }
});


// DELETE will destroy a singular comment from the database. BOTH the user that made the post
// and the user that wrote the post have delete access.

commentsRouter.delete('/:id/:userId', async (req:any, res:any) => {
  const { id, userId } = req.params;
  try {
    // maybe I check id's on the client's side?
    const checkCredentials = await prisma.comment.findFirst({
      where: {
        userId: +userId,
        id: +id,
      }
    })
    if(checkCredentials) {
      const killComment = await prisma.comment.delete({
        where: {id: +id}
      })
      res.status(200).send('comment deleted!');
    } else {
      res.status(403).send('you cannot delete this comment');
    }

    } catch (err){
    console.error('unable to delete comment', err);
    res.sendStatus(500);
  }
});


export default commentsRouter;