const express = require('express');
import { PrismaClient } from '@prisma/client';

const voteRouter = express.Router();
const prisma = new PrismaClient();

//'/:id/:itemId/:type'

// voteRouter.get().then().catch();
// check with working votes for what comes in the req.body
// BEFORE changing the post to upsert..
voteRouter.post('/', async (req: any, res: any) => {
  console.log('started the post, req it', req.body);

  try {
  const makeVote = await prisma.vote.create(req.body)
  console.log('after the create..')
    res.status(201).send('Noted!');
  } catch (err) {
    console.error('unable to log vote', err);
      res.sendStatus(500);
  }
})

/**
 * UPSERT EXAMPLE:
 * await prisma.like.upsert({
  where: {
    likeId: {
      userId: 1,
      postId: 1,
    },
  },
  update: {
    userId: 2,
  },
  create: {
    userId: 2,
    postId: 1,
  },
})

IF THE VOTE DISPLAYED HAS A USER ASSOCIATED, THE VOTE BUTTON WILL DO... SOMETHING
 */
// UNDO A LIKE
// voteRouter.delete().then().catch();

export default voteRouter