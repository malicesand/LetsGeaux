const express = require('express');
import { PrismaClient } from '@prisma/client';

const voteRouter = express.Router();
const prisma = new PrismaClient();

//'/:id/:itemId/:type'

// voteRouter.get().then().catch();

voteRouter.post('/', async (req: any, res: any) => {
  console.log('started the post, req it', req.body);
  // const { id, itemId, type } = req.params;
// let votee;
//   switch (type) {
// case "post":
//   votee = "post";
//   break;
// case "comment":
//   votee = "comment";
//   break;
// case "suggestion":
//   votee = "suggestion";
//   break;
//   }
  try {
  console.log('oh lawd, she tryin')
  // console.log()
  // console.log()
  
  const makeVote = await prisma.vote.create(req.body)
  console.log('after the create..')
    res.status(201).send('Noted!');
  } catch (err) {
    console.error('unable to log vote', err);
      res.sendStatus(500);
  }
})

// voteRouter.patch().then().catch();

// not super sure this will be needed yet, but:
// voteRouter.delete().then().catch();

export default voteRouter