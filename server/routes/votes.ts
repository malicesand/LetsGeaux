const express = require('express');
import { PrismaClient } from '@prisma/client';

const voteRouter = express.Router();
const prisma = new PrismaClient();

//'/:id/:itemId/:type'
//pulling votes to check for matches on client side
voteRouter.get(`/:userId/:typeId/:type`, async (req:any, res:any) => {
const {userId, typeId, type} = req.params;

const findTypeObj = {
  userId: +userId
}

if (type === 'comment') {
findTypeObj.commentId = +typeId;
} else if (type === 'post') {
  findTypeObj.postId = +type.id;
}
console.log('obj', findTypeObj)
try {
const idForChecking = await prisma.vote.findFirst({
  where: findTypeObj
})
// console.log('the checking id', idForChecking)
if (idForChecking !== null) {

  const typeCheckObj = {
    id: idForChecking.id
  }
  
  if (type === 'comment') {
    typeCheckObj.commentId = +typeId;
  } else if (type === 'post') {
    typeCheckObj.postId = +type.id;
  }
  
  
  const allMatches = await prisma.vote.findFirst({
    where: typeCheckObj,
  })
  res.status(200).send(allMatches);
} else {
  res.status(200).send('no match')
}

} catch (err) {
  console.error('unable to search', err);
  res.sendStatus(500);
}



})
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
    console.log('the req', req.body)
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
voteRouter.delete(`/:userId/:typeId/:type`, async (req: any, res: any) => {
  const {userId, typeId, type } = req.params;

  // findingVote is the object that takes either a comment or post and looks for its userId/typeId in the vote schema.
  // this object is constructed to add suggestions more easily if needed
  const findingVote = {
    userId: +userId
  }
  
  if (type === 'comment') {
    findingVote.commentId = +typeId;
  } else if (type === 'post') {
    findingVote.postId = +type.id;
  }
  try {
    // query for the first vote that matches  the values specified above
    const findVote = await prisma.vote.findFirst({
      where: findingVote,
    })
    if (findVote) {
      // this is the object for comparison with the newly found voteId. Thinking I can possibly just use this value to delete, now
      const deletedVote = {
        id: +findVote.id
      }
      
      if (type === 'comment') {
        deletedVote.commentId = +typeId;
      } else if (type === 'post') {
        deletedVote.postId = +type.id;
      }
      
      console.log('found', findVote)
      const loseVote = await prisma.vote.delete({
        where: deletedVote,
      })
      console.log(loseVote);
      res.status(200).send('successful deletion');
    } else {
      res.status(404).send('no vote found');
    }
  } catch (err) {
    console.error('failed to delete vote', err);
  res.sendStatus(500);
  }
  
})

export default voteRouter