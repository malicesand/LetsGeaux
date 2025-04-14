// import express from 'express';
// import { PrismaClient } from '@prisma/client';
// import { v4 as uuidv4 } from 'uuid'
// const prisma = new PrismaClient();

// const itineraryRoute = express.Router();

// // itineraryRoute.get('/', async (req: any, res: any )=>{
 
// // try{
// //   const itineraries = await prisma.itinerary.findMany({
// //    where: {creatorId : req.user.id}
// //   })
// // res.status(200).json(itineraries)
// // }catch(error){
// // res.status(500).json({error: 'Error fetching itinerary'})
// // }

// // })

// // //added unique code
// // itineraryRoute.post('/', async (req: any, res: any) => {
// //   const { creatorId, name, notes, begin, end, upVotes, downVotes } = req.body;

// //   // Check if the creator exists
// //   const userExists = await prisma.user.findUnique({
// //     where: { id: creatorId },
// //   });

// //   if (!userExists) {
// //     return res.status(400).json({ error: 'Creator not found' });
// //   }

// //   // Validate the required fields
// //   if (!name || !begin || !end) {
// //     return res.status(400).json({ error: 'Missing required fields' });
// //   }

// //   const startDate = new Date(begin);
// //   const endDate = new Date(end);
// //   if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
// //     return res.status(400).json({ error: 'Invalid date format' });
// //   }

// //   const viewCode = uuidv4().slice(0, 4); // Generate view code

// //   try {
// //     // Create the new itinerary
// //     const newItinerary = await prisma.itinerary.create({
// //       data: {
// //         creatorId,
// //         name,
// //         notes,
// //         begin: startDate, 
// //         end: endDate,     
// //         upVotes: upVotes ?? 0,
// //         downVotes: downVotes ?? 0,
// //         createdAt: new Date(),
// //         viewCode,
// //       },
// //     });

// //     res.status(201).json(newItinerary);
// //   } catch (error) {
// //     console.error('Error creating itinerary:', error);
// //     res.status(500).json({ error: 'Error creating itinerary', details: error.message });
// //   }
// // });


// // itineraryRoute.patch('/:id', async (req: any, res: any) => {
// //   const { id } = req.params;
// //   const { name, notes, begin, end, upVotes, downVotes } = req.body;

 

// //   try {
// //     const updateItinerary = await prisma.itinerary.update({
// //       where: { id: Number(id) },
// //       data: {
// //         name,
// //         notes,
// //         begin: new Date(begin),
// //         end: new Date(end),
// //         upVotes,
// //         downVotes,
// //       },
// //     });

// //     res.status(200).json(updateItinerary);
// //   } catch (error) {
// //     console.error('Error updating itinerary:', error);
// //     res.status(500).json({ error: 'Error updating itinerary' });
// //   }
// // });

// //   itineraryRoute.delete('/:id', async (req: any, res: any) =>{
// //   const {id } = req.params
// //   try{
// //     const deleteIntinerary = await prisma.itinerary.delete({
// //       where: {
// //         id: Number(id)
// //       }
// //     })
// //     console.log(deleteIntinerary)
// //   res.status(200).json({message: `Itinerary ${id} has been successfully deleted`, deleteIntinerary})
// //   }catch(error){
// //   res.status(500).json({error: 'Error deleting itinerary'})
// //   }
  
// //   }) 




// //   itineraryRoute.get('/view/:viewCode', async (req: any, res: any) => {
// //     const { viewCode } = req.params;
  
// //     try {
// //       // Fetch the itinerary based on the view code
// //       const itinerary = await prisma.itinerary.findUnique({
// //         where: {
// //           viewCode: viewCode, 
// //         },
// //         include: {
// //           activity: true,  
// //           route: true,     
// //           creator: {
// //             select: {
// //               id: true,
              
// //             },
// //           },
// //         },
// //       });
  
// //       if (!itinerary) {
// //         return res.status(404).json({ error: 'Itinerary not found' });
// //       }
  
// //       res.json(itinerary); 
// //     } catch (error) {
// //       console.error('Error fetching itinerary:', error);
// //       res.status(500).json({ error: 'Internal server error' });
// //     }
// //   });
 






// // Get itineraries by creatorId
// itineraryRoute.get('/', async (req: any, res: any) => {
//   try {
//     const itineraries = await prisma.itinerary.findMany({
//       where: { creatorId: req.user.id }
//     });
//     res.status(200).json(itineraries);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching itinerary' });
//   }
// });

// // Create a new itinerary
// itineraryRoute.post('/', async (req: any, res: any) => {
//   const { creatorId, name, notes, begin, end, upVotes, downVotes } = req.body;

//   // Check if the creator exists
//   const userExists = await prisma.user.findUnique({
//     where: { id: creatorId },
//   });

//   if (!userExists) {
//     return res.status(400).json({ error: 'Creator not found' });
//   }

//   // Validate the required fields
//   if (!name || !begin || !end) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   const startDate = new Date(begin);
//   const endDate = new Date(end);
//   if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//     return res.status(400).json({ error: 'Invalid date format' });
//   }

//   const viewCode = uuidv4().slice(0, 4); // Generate view code

//   try {
//     // Create the new itinerary
//     const newItinerary = await prisma.itinerary.create({
//       data: {
//         creatorId,
//         name,
//         notes,
//         begin: startDate,
//         end: endDate,
//         upVotes: upVotes ?? 0,
//         downVotes: downVotes ?? 0,
//         createdAt: new Date(),
//         viewCode,
//       },
//     });

//     res.status(201).json(newItinerary);
//   } catch (error) {
//     console.error('Error creating itinerary:', error);
//     res.status(500).json({ error: 'Error creating itinerary', details: error.message });
//   }
// });




// // itineraryRoute.post('/', async (req: any, res: any) => {
// //   const { creatorId, name, notes, begin, end, upVotes, downVotes, partyId } = req.body;

// //   const userExists = await prisma.user.findUnique({
// //     where: { id: creatorId },
// //   });

// //   if (!userExists) {
// //     return res.status(400).json({ error: 'Creator not found' });
// //   }

// //   if (!name || !begin || !end) {
// //     return res.status(400).json({ error: 'Missing required fields' });
// //   }

// //   const startDate = new Date(begin);
// //   const endDate = new Date(end);
// //   if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
// //     return res.status(400).json({ error: 'Invalid date format' });
// //   }

// //   const viewCode = uuidv4().slice(0, 4); 

// //   try {
    
// //     const newItinerary = await prisma.itinerary.create({
// //       data: {
// //         creatorId,
// //         name,
// //         notes: notes ?? '',
// //         begin: startDate,
// //         end: endDate,
// //         upVotes: upVotes ?? 0,
// //         downVotes: downVotes ?? 0,
// //         createdAt: new Date(),
// //         viewCode,
// //         ...(partyId && { partyId }), 
// //       },
// //       include: {
// //         party: true, 
// //       },
// //     });

// //     res.status(201).json({ success: true, itinerary: newItinerary });
// //   } catch (error: any) {
// //     console.error('Error creating itinerary:', error);
// //     res.status(500).json({
// //       success: false,
// //       error: 'Error creating itinerary',
// //       details: error.message,
// //     });
// //   }
// // });
// // Update an itinerary
// itineraryRoute.patch('/:id', async (req: any, res: any) => {
//   const { id } = req.params;
//   const { name, notes, begin, end, upVotes, downVotes } = req.body;

//   try {
//     const itinerary = await prisma.itinerary.findUnique({
//       where: { id: Number(id) },
//       include: {
//         creator: true,
//         party: true, // Fetch the associated party
//       },
//     });

//     if (!itinerary) {
//       return res.status(404).json({ error: 'Itinerary not found' });
//     }

//     // Check if the user is the creator or part of the same party
//     if (
//       itinerary.creatorId !== req.user.id &&
//      !itinerary.partyId &&  // If no party is associated, allow access only to creator
//       itinerary.partyId !== req.user.partyId // If there is a party, ensure the user is part of it
//     ) {
//       return res.status(403).json({ error: 'You are not authorized to update this itinerary' });
//     }

//     const updatedItinerary = await prisma.itinerary.update({
//       where: { id: Number(id) },
//       data: {
//         name,
//         notes,
//         begin: new Date(begin),
//         end: new Date(end),
//         upVotes,
//         downVotes,
//       },
//     });

//     res.status(200).json(updatedItinerary);
//   } catch (error) {
//     console.error('Error updating itinerary:', error);
//     res.status(500).json({ error: 'Error updating itinerary' });
//   }
// });

// // Delete an itinerary
// itineraryRoute.delete('/:id', async (req: any, res: any) => {
//   const { id } = req.params;

//   try {
//     const itinerary = await prisma.itinerary.findUnique({
//       where: { id: Number(id) },
//       include: {
//         creator: true,
//       },
//     });

//     if (!itinerary) {
//       return res.status(404).json({ error: 'Itinerary not found' });
//     }

//     // Ensure only the creator can delete the itinerary
//     if (itinerary.creatorId !== req.user.id) {
//       return res.status(403).json({ error: 'You are not authorized to delete this itinerary' });
//     }

//     const deletedItinerary = await prisma.itinerary.delete({
//       where: { id: Number(id) },
//     });

//     res.status(200).json({
//       message: `Itinerary ${id} has been successfully deleted`,
//       deletedItinerary,
//     });
//   } catch (error) {
//     console.error('Error deleting itinerary:', error);
//     res.status(500).json({ error: 'Error deleting itinerary' });
//   }
// });

// // Get itinerary by view code
// itineraryRoute.get('/view/:viewCode', async (req: any, res: any) => {
//   const { viewCode } = req.params;

//   try {
//     const itinerary = await prisma.itinerary.findUnique({
//       where: { viewCode: viewCode },
//       include: {
//         activity: true,
//         route: true,
//         creator: {
//           select: { id: true },
//         },
//       },
//     });

//     if (!itinerary) {
//       return res.status(404).json({ error: 'Itinerary not found' });
//     }

//     res.json(itinerary);
//   } catch (error) {
//     console.error('Error fetching itinerary:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // itineraryRoute.post('/party', async (req: any, res: any) => {
// //   const { creatorId, name, notes, begin, end, upVotes, downVotes, partyId } = req.body;

// //   // Check if the creator exists
// //   const userExists = await prisma.user.findUnique({
// //     where: { id: creatorId },
// //   });

// //   if (!userExists) {
// //     return res.status(400).json({ error: 'Creator not found' });
// //   }

// //   // Validate the required fields
// //   if (!name || !begin || !end || !partyId) {
// //     return res.status(400).json({ error: 'Missing required fields' });
// //   }

// //   const startDate = new Date(begin);
// //   const endDate = new Date(end);
// //   if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
// //     return res.status(400).json({ error: 'Invalid date format' });
// //   }

// //   // Generate a viewCode even for the party itinerary (if required)
// //   const viewCode = uuidv4().slice(0, 4);

// //   try {
// //     // Create the party-specific itinerary
// //     const newItinerary = await prisma.itinerary.create({
// //       data: {
// //         creatorId,
// //         name,
// //         notes,
// //         begin: startDate,
// //         end: endDate,
// //         upVotes: upVotes ?? 0,
// //         downVotes: downVotes ?? 0,
// //         createdAt: new Date(),
// //         partyId, // Link the itinerary to a party
// //         viewCode, // Ensure the viewCode is included
// //       },
// //     });

// //     res.status(201).json(newItinerary);
// //   } catch (error) {
// //     console.error('Error creating party itinerary:', error);
// //     res.status(500).json({ error: 'Error creating party itinerary', details: error.message });
// //   }
// // });



// // itineraryRoute.post('/', async (req: any, res: any) => {
// //   const { name, notes, partyId, userId, begin, end } = req.body;

// //   if (!name || !userId || !begin || !end) {
// //     return res.status(400).json({ success: false, message: 'Missing fields' });
// //   }

// //   try {
// //     const newItinerary = await prisma.itinerary.create({
// //       data: {
// //         name,
// //         notes,  // Use notes instead of description
// //         partyId: partyId ?? null,  // If partyId exists, use it, otherwise set to null
// //         creatorId: userId,
// //         begin: new Date(begin),  // Convert to Date object
// //         end: new Date(end),  // Convert to Date object
// //         upVotes: 0,  // Default value
// //         downVotes: 0,  // Default value
// //         createdAt: new Date(),  // Set to current time
// //         viewCode: uuidv4().slice(0, 4),  // Optional, if needed
// //       },
// //     });

// //     return res.json({ success: true, itinerary: newItinerary });
// //   } catch (err) {
// //     console.error(err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// export default itineraryRoute;










import express from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const itineraryRoute = express.Router();

//GET all itineraries for the logged-in user (creator)
itineraryRoute.get('/', async (req: any, res: any) => {
  try {
    const itineraries = await prisma.itinerary.findMany({
      where: { creatorId: req.user.id },
    });
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching itineraries' });
  }
});





// itineraryRoute.get('/', async (req: any, res: any) => {
//   try {
//     // Fetch all itineraries without authentication (No need for req.user)
//     const itineraries = await prisma.itinerary.findMany();
//     res.status(200).json(itineraries);
//   } catch (error) {
//     console.error('Error fetching itineraries:', error);
//     res.status(500).json({ error: 'Error fetching itineraries' });
//   }
// });



// POST create a new itinerary
itineraryRoute.post('/', async (req: any, res: any) => {
  const { creatorId, name, notes, begin, end, upVotes, downVotes, partyId } = req.body;

  // Check if the user exists
  const userExists = await prisma.user.findUnique({
    where: { id: creatorId },
  });

  if (!userExists) {
    return res.status(400).json({ error: 'Creator not found' });
  }

  // Ensure required fields are provided
  if (!name || !begin || !end) {
    return res.status(400).json({ error: 'Missing required fields: name, begin, end' });
  }

  // Parse and validate dates
  const startDate = new Date(begin);
  const endDate = new Date(end);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Generate a random 4-character view code
  const viewCode = uuidv4().slice(0, 4);

  try {
    // Create the new itinerary with required properties
    const newItinerary = await prisma.itinerary.create({
      data: {
        creatorId,
        name,
        notes: notes ?? '',
        begin: startDate,
        end: endDate,
        upVotes: upVotes ?? 0, 
        downVotes: downVotes ?? 0, 
        createdAt: new Date(), 
        viewCode, // 
        partyId, 
      },
    });

    res.status(201).json(newItinerary);
    
  } catch (error: any) {
    // Handle unexpected errors
    console.error('Error creating itinerary:', error);
    res.status(500).json({ error: 'Error creating itinerary', details: error.message });
  }
});

// PATCH update itinerary (creator or party member)
itineraryRoute.patch('/:id', async (req: any, res: any) => {
  const { id } = req.params;
  const { name, notes, begin, end, upVotes, downVotes } = req.body;

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: Number(id) },
      include: { party: true },
    });

    if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });

    const userId = req.user.id;
    const userPartyId = req.user.partyId;

    const isCreator = itinerary.creatorId === userId;
    const isInParty = itinerary.partyId && itinerary.partyId === userPartyId;

    if (!isCreator && !isInParty) {
      return res.status(403).json({ error: 'You are not authorized to update this itinerary' });
    }

    const updatedItinerary = await prisma.itinerary.update({
      where: { id: Number(id) },
      data: {
        name,
        notes,
        begin: new Date(begin),
        end: new Date(end),
        upVotes,
        downVotes,
      },
    });

    res.status(200).json(updatedItinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({ error: 'Error updating itinerary' });
  }
});

// DELETE itinerary (only by creator)
itineraryRoute.delete('/:id', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: Number(id) },
    });

    if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });

    if (itinerary.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this itinerary' });
    }

    const deletedItinerary = await prisma.itinerary.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: `Itinerary ${id} has been successfully deleted`,
      deletedItinerary,
    });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({ error: 'Error deleting itinerary' });
  }
});

// GET itinerary by view code (public view)
itineraryRoute.get('/view/:viewCode', async (req: any, res: any) => {
  const { viewCode } = req.params;

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { viewCode },
      include: {
        activity: true,
        route: true,
        creator: { select: { id: true } },
      },
    });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    res.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default itineraryRoute;
