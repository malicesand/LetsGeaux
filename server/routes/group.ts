import express from 'express';
import { PrismaClient } from '@prisma/client';

const groupRoute = express.Router();
const prisma = new PrismaClient();

// * Create Travel Party * //
groupRoute.post('/', async (req: any, res: any) => {
  // console.log(req.body)
  const {name} = req.body;
  try {
    const newParty = await prisma.party.create({data: { name }});
    console.log('successfully created new travel party', newParty)
    res.json(newParty)
  } catch(error) {
    console.error('failed to create new party', error);
    res.status(500).json({ error:'failure creating party'});
  }
});
//* Add User to Party *//
groupRoute.post('/userParty', async (req: any, res: any) => {
  console.log(`userPost creation${req.body}`)
  const {userId, partyId, } = req.body;

  try {
    const addUserToParty = await prisma.userParty.create({
      data: {
       userId,
       partyId: +partyId
      }
    });
    
    console.log("successfully added user to party",addUserToParty)
    res.json(addUserToParty)

  } catch(error) {
    console.error('failed to create new user party', error);
    res.status(500).json({ error:'failure creating party'});

  }
})

export default groupRoute;
