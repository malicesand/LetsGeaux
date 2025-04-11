import express from 'express';
import { PrismaClient } from '@prisma/client';
import sgMail from '@sendgrid/mail';
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

//* Add Existing User to Party *//
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

//* Inviting Users to LetsGeaux Via Email *//
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
groupRoute.post('/sendInvite', async (req: any, res:any) => {
  const {emails, partyName} = req.body
  console.log(partyName);
  console.log(emails);
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'No valid emails provided' });
  }
  const sendPromises = emails.map((email: string) => {
    const msg = {
      to: email, // Change to your recipient
      from: 'invite@letsgeauxnola.com', // Change to your verified sender
      subject: 'Join me on Lets Geaux Nola!',
      text: `Join my travel party ${partyName} on LetsGeauxNola.com!`,
      html: `<strong>Join my travel party ${partyName} on LetsGeauxNola.com!</strong>`,
    };
    return sgMail.send(msg)
  });
  try {
    await Promise.all(sendPromises);
    console.log('Invites sent')
    res.json({message: 'Invites sent successfully'});
  } catch (error){
    console.error('Error sending invites:', error);
    res.status(500).json({ error: 'Failed to send some or all invites' })
  }
  // sgMail.send(msg)
  // .then(() => {
  //   console.log('Email sent')
  //   res.json({message:'email sent'})
  // })
  // .catch((error) => {
  //   console.error(error)
  // })
});

export default groupRoute;
