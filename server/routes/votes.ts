const express = require('express');
import { PrismaClient } from '@prisma/client';

const voteRouter = express.Router();
const prisma = new PrismaClient();

//'/:id/:itemId/:type'

// voteRouter.get().then().catch();
// check with working votes for what comes in the req.body
// BEFORE changing the post to upsert..
voteRouter.post('/:userId/:typeId/:type', async (req: any, res: any) => {
  const { userId, typeId, type } = req.params;
  // creating an object for the where portion of upsert. start w user id, split off at type
  // const id = userId
  const typeCheck = {
    id: +userId,
  };
  switch (type) {
    case "suggestion":
      typeCheck.suggestionId = +typeId;
      break;
    case "post":
      typeCheck.postId = +typeId;
      break;
    case "comment":
      typeCheck.commentId = +typeId;
      break;
  }
  try {
  const makeOneVote = await prisma.vote.upsert({
    where: typeCheck,
    update: {
      polarity: req.body.data.polarity
    },
    create: req.body.data,

  })
  console.log('after the create..')
    res.status(201).send('Noted!');
  } catch (err) {
    console.error('unable to log vote', err);
      res.sendStatus(500);
  }
})



/*IF THE VOTE DISPLAYED HAS A USER ASSOCIATED, THE VOTE BUTTON WILL DO... SOMETHING
 */
// UNDO A LIKE
// voteRouter.delete().then().catch();

export default voteRouter