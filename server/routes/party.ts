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
  console.log(`userPost creation${req.body}`)
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
    res.json({message: 'Invites sent successfully'});
  } catch (error){
    console.error('Error sending invites:', error);
    res.status(500).json({ error: 'Failed to send some or all invites' })
  }
});

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
    // console.log(`Found the userParty Names`);
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
  // delete userParties
  const deleteUserParties = prisma.userParty.deleteMany({
    where: {
      partyId: +partyId,
    },
  })
  // delete party
  const deleteParty = prisma.party.delete({
    where: {
      id: +partyId,
    },
  })
  // TODO add email to transaction? 
  try { 
    // transaction
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
// partyRoute.delete('/userParty/:partyId, userId', async (req: any, res: any) => {
//   const {partyId, userId} = req.params;
//   console.log(req.params);
//   // delete userParty
//   // const deleteMember = prisma.userParty.delete
//   // delete party?
//   try {
//     const deleteMember = await prisma.userParty.delete({
//       where: {partyId: +partyId}, {userId: +userId},
      
//     })
    
//     console.log(`Request Complete: Delete User ${userId} from Party ${partyId}`);
//     res.status(200).json(`Request Complete: Delete User ${userId} from Party ${partyId}`)
//   } catch (error) {
//     console.error(`Failure: Delete ${userId}`, error);
//     res.status(500).json({error:`Failure: Delete ${userId}`})
//   }
// }) 

export default partyRoute;
