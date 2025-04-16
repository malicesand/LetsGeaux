import express from 'express';
import { PrismaClient } from '@prisma/client';
import sgMail from '@sendgrid/mail';
const partyRoute = express.Router();
const prisma = new PrismaClient();


// * Create Travel Party * //
partyRoute.post('/', async (req: any, res: any) => {
  // console.log(req.body)
  const {name} = req.body;
  try {
    const newParty = await prisma.party.create({data: { name }});
    console.log(`Request complete: Create Party ${name}`)
    res.json(newParty)
  } catch(error) {
    console.error(`Failure: Create Party ${name}`, error);
    res.status(500).json({ error:'failure creating party'});
  }
});

//* Add Existing User to Party *//
partyRoute.post('/userParty', async (req: any, res: any) => {
  const {userId, partyId, } = req.body;
  try {
    const addUserToParty = await prisma.userParty.create({
      data: {
       userId,
       partyId: +partyId
      }
    });
    console.log('Request complete: Add User to Party')
    res.json(addUserToParty)
  } catch(error) {
    console.error('Failure: Add User to Party', error);
    res.status(500).json({ error:'Failure: Add User to Party'});
  }
})

//* Inviting Users to LetsGeaux Via Email *//
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
partyRoute.post('/sendInvite', async (req: any, res:any) => {
  const {emails, partyName} = req.body
  console.log(partyName);
  console.log(emails);
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'No valid emails provided' });
  }
  const sendPromises = emails.map((email: string) => {
    const msg = {
      to: email, 
      from: 'invite@letsgeauxnola.com', 
      subject: 'Join me on Lets Geaux Nola!',
      text: `Join my travel party ${partyName} on LetsGeauxNola.com!`,
      html: `<strong>Join my travel party ${partyName} on LetsGeauxNola.com!</strong>`, // TODO fix html
    };
    return sgMail.send(msg) // TODO call post emails?
  });
  try {
    await Promise.all(sendPromises);
    res.json({message: 'Invites sent successfully'});
  } catch (error){
    console.error('Error sending invites:', error);
    res.status(500).json({ error: 'Failed to send some or all invites' })
  }
});

//* Create Email Record *//
partyRoute.post('/emails', async (req: any, res: any) => {
  const {address, sender} = req.body;
  
  console.log(req.body, 'body');
  console.log(address, 'address');
  console.log(sender, 'sender');
  try { 
    const emailRecord = await prisma.emails.create({
      data: {
        address,
        userId: +sender,
      }
    })
    console.log(`Request Complete: Add Email Record ${address}`);
    res.json(`Request Complete: Add Email Record ${address}`)
  } catch (error) {
    console.error(`Failure: Add Email Record ${address}`, error);
    res.status(500).json({error: `Failure: Add Email Record ${address}`});
  }
})

// * Get A User's Parties * //
partyRoute.get('/userParty/:userId', async (req: any, res: any) => {
  const {userId} = req.params;
  try {
    let parties = await prisma.userParty.findMany({
      where: {
        userId: +userId,
      },
    })
    res.json(parties);
  } catch (error) {
    console.error('Could not find any parties for user');
    res.status(500).json({ error: 'This user many not have any parties' })
  }
})

// * Get a Party * //
partyRoute.get('/:partyId', async(req: any, res: any) => {
  const {partyId} = req.params;
  try {
    let partyInfo = await prisma.party.findUnique({
      where: {
        id: +partyId,
      }
    })
    res.json(partyInfo);
  } catch (error) {
    console.error('Could not find any party names for this ID', error);
    res.status(500).json({error: 'no party names found'})
  }
})

// * Get the Members of the Travel Party * //
partyRoute.get('/usersInParty/:partyId', async (req: any, res: any) => {
  const {partyId} = req.params;
  try {
    const usersInParty = await prisma.userParty.findMany({
      where: {
        partyId: +partyId,
      },
      include: {
        user: true,
      },
    });
    const users = usersInParty.map(entry => entry.user);
    res.json(users); 
  } catch (error) {
    console.error('failed to find members for this travel party', error);
    res.status(500).json({ error: 'Could not fetch users in the party'});
  }
});

//* Delete a Party *//
partyRoute.delete('/:partyId', async (req: any, res: any) => {
  const {partyId} = req.params;
  const deleteUserParties = prisma.userParty.deleteMany({
    where: {
      partyId: +partyId,
    },
  })
  const deleteParty = prisma.party.delete({
    where: {
      id: +partyId,
    },
  })
  // TODO add email to transaction? Cascade?
  try { 
    const transaction = await prisma.$transaction([deleteUserParties, deleteParty]);
    console.log(`Transaction Complete: Delete Party ${partyId}`);
    res.status(200).json(`Transaction Complete: Delete Party ${partyId}`);
  } catch (error) {
    console.log(`Transaction Failure: Delete Party ${partyId}`, error);
    res.status(500).json({ error: `Transaction Failure: Delete Party ${partyId}`});
  };
})

//* Rename a Party *//
partyRoute.patch('/:partyId', async (req: any, res: any) => {
  const {partyId} = req.params;
  const {name} = req.body;
  try {
    const renameParty = await prisma.party.update({
      where: {id: +partyId},
      data: {name: name},
    })
    console.log(`Request Complete: Rename Party ${partyId} to ${name}`);
    res.json(`Request Complete: Rename Party ${partyId} to ${name}`)
  } catch (error) {
    console.error(`Failure: Rename Party ${partyId}`, error);
    res.status(500).json({error: `Failure: Rename Party ${partyId}`});
  }
})

//* Delete Party Member */
partyRoute.delete('/userParty/:id', async (req: any, res: any) => {
  const {id} = req.params;
  console.log(req.params);
  try {
    const deleteMember = await prisma.userParty.delete({
      where: { id: +id },
    })
    console.log(`Request Complete: Delete User @ userParty${id}`);
    res.json(`Request Complete: Delete User @ userParty${id}`)
  } catch (error) {
    console.error(`Failure: Delete`, error);
    res.status(500).json({error:`Failure: Delete @ userParty${id}`})
  }
}) 

export default partyRoute;
