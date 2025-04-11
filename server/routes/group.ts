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

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

groupRoute.post('/sendInvite', async (req: any, res:any) => {
  const {email, partyName} = req.body
  console.log(partyName)
console.log(email);
  const msg = {
    to: {email}, // Change to your recipient
    from: 'invite@letsgeauxnola.com', // Change to your verified sender
    subject: 'Join me on Lets Geaux Nola!',
    text: `Join my travel party ${partyName} on LetsGeauxNola.com!`,
    html: `<strong>Join my travel party ${partyName} on LetsGeauxNola.com!</strong>`,
  }

  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
    res.json({message:'email sent'})
  })
  .catch((error) => {
    console.error(error)
  })
});

export default groupRoute;
