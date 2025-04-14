const express = require('express');
import { PrismaClient } from '@prisma/client';

const voteRouter = express.Router();
const prisma = new PrismaClient();

//'/:id/:itemId/:type'

// voteRouter.get().then().catch();
// check with working votes for what comes in the req.body
// BEFORE changing the post to upsert..
voteRouter.post('/:id/:suggestionId', async (req: any, res: any) => {
  const { userId, suggestionId } = req.params;

  try {
  const makeOneVote = await prisma.vote.upsert({
    where: {
        userId: +userId,
        suggestionId: +suggestionId,
    },
    create: req.body.data,
    update: {
      polarity: req.body.data.polarity
    }

  })
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