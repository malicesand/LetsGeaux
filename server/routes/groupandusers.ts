import express from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
const groupRouter = express.Router();
const prisma = new PrismaClient();


//POST for users to add to itinerary
groupRouter.post('/:groupId/itinerary', async (req: any, res: any) => {
  const { groupId } = req.params; // Get group ID from request
  const { name, begin, end, notes } = req.body; // Get itinerary details from the request body

  try {
    const userId = req.user.id; // Get the logged-in user's ID

    // Check if the user is part of the group by querying userGroups table
    const userGroup = await prisma.userGroups.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId: Number(groupId),
        },
      },
    });

    if (!userGroup) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    // Proceed with creating the itinerary if user is part of the group
    const newItinerary = await prisma.itinerary.create({
      data: {
        name,
        begin,
        end,
        notes,
        groupId: Number(groupId), // Link itinerary to group
        creatorId: userId, // Set the user as the creator
      },
    });

    res.json(newItinerary); // Send back the created itinerary
  } catch (error) {
    console.error('Error creating itinerary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// for users to edit itinerary
groupRouter.put('/:groupId/itinerary/:itineraryId', async (req: any, res: any) => {
  const { groupId, itineraryId } = req.params;
  const { name, begin, end, notes } = req.body;

  try {
    const userId = req.user.id; // Get the logged-in user's ID

    // Check if the user is part of the group by querying userGroups table
    const userGroup = await prisma.userGroups.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId: Number(groupId),
        },
      },
    });

    if (!userGroup) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    // Check if the itinerary exists and belongs to the group
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: Number(itineraryId) },
    });

    if (!itinerary || itinerary.groupId !== Number(groupId)) {
      return res.status(404).json({ error: 'Itinerary not found or does not belong to this group' });
    }

    // Proceed with updating the itinerary
    const updatedItinerary = await prisma.itinerary.update({
      where: { id: Number(itineraryId) },
      data: {
        name,
        begin,
        end,
        notes,
      },
    });

    res.json(updatedItinerary); // Send back the updated itinerary
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





//DELETE GROUP
// groupRouter.delete('/', async(req:any, res: any)=>{
//   const { id} = req.params
//   try{
//     const deleteGroup = await prisma.group.delete({
// where: {
//   id: Number(id),
// }
//     })
//     res.status(200).json({deleteGroup});
//   }catch(error){
//     res.status(500).json({message:'Error deleting group:', error})
//   }
// })







//jackbox view 
// to create a code 
//map is used nut needs to be replaced for more of a permanent solution
// to add new table to schema for viewCode
const viewCodeStore = new Map(); 

groupRouter.get('/:groupId/itinerary/view', async(req: any, res: any)=>{
  const {groupId} = req.params
  try{
    const group = await prisma.group.findUnique({
      where: { id: Number(groupId)}
    })

   
    if(!group){
      return res.status(404).json({error: 'Group not found'})
    }
  
  
    const viewCode = uuidv4();
    console.log(`Generated viewCode ${viewCode} for groupId ${groupId}`);
//TODO: add viewCode model to schema
  //  await prisma.viewCode.create({
  //   data: {
  //     code: viewCode,
  //     groupId: Number(groupId)
  //   }
  //  })
    res.status(201).json({ viewCode })
    
  }catch(error){
    console.error('Error generating view code:', error)
    res.status(500).json({error: 'Internal server error'})
  }
})

//sharing itinerary for users without aacount( view only)

groupRouter.get('/itinerary/view/:viewCode', async (req: any, res: any) => {
  const { viewCode } = req.params; // Get the view code from the request

  try {
    // Retrieve the groupId associated with this view code
    //TODO:
    // const codeEntry = await prisma.viewCode.findUnique({
    //   where: {
    //     code: viewCode
    //   }
    // });
    //TODO:
    // if (!codeEntry) {
    //   return res.status(404).json({ error: 'Invalid view code' });
    // }

    //Fetch the itinerary based on the groupId
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        //TODO
      //  groupId: codeEntry.groupId, 
      },
      include: {
        activity: true,
        route: true,
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
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

export default groupRouter;

// //POST 

// activityRouter.post('/', async(req: any, res: any) =>{
// try{
//   const userId = req.user.id
//   const { name, description, time, date, location, image, phone, address, itineraryId } = req.body;
  
//   const newActivity = await prisma.activity.create({
//     data: {
//       name,
//       description,
//       time,
//       date,
//       location,
//       image,
//       phone,
//       address,
//       itineraryId: itineraryId,
//     },
//   })
//   res.status(201).json(newActivity);
// }catch(error){
//   console.error('Error creating activity:', error);
//   res.sendStatus(500);
// }
// })

// //GET
// activityRouter.get('/:itineraryId/users', async(req: any, res: any) =>{
//   try{
//   const{} = req.body
//     res.status(200).json()
//   }catch(errorr){
  
//   }
//   })

// //UPDATE
// activityRouter.patch('/', async(req: any, res: any) =>{
//   const{ id } = req.params
//   const userId = req.user.id
//   try{
//   const{} = req.body
//     res.status(200).json()
//   }catch(errorr){
  
//   }
//   })

// //DELETE
// activityRouter.delete('/', async(req: any, res: any) =>{
//   const{ id } = req.params
//   const userId = req.user.id
//   try{
//     const activity = await prisma.activity.findUnique({where:{
//       id:Number(id)
//     }
//   })
//     const deletActivity = await prisma.activity 
//     res.status(200).json()
//   }catch(error){
//   console.error('Error deleting activity:', error)
//   res.sendStatus
//   }
//   })


//POST //create group of existing users
// groupRouter.post('/', async (req:any, res:any)=>{
// try{
//   const {userIds, itineraryId, activityId} = req.body
// const group = await prisma.group.create({
//   data: {
//     itinerary_id: itineraryId,
//     //TODO: add to schema--- prisma wants activityId
//     activity_id: activityId,
//     user_id:{
//       connect: userIds.map((id:number)=>({id})),
//   },
// },

//   include: {
//     user_id: true
//   }
// })

// res.status(201).json(group)
// }catch(error){
// res.status(500).json({error: 'Error creating group'})
// }
// })


// inviting user to view itinerary(view only)
//using email or url to send jackbox code


// groupRouter.get('/:groupId/itinerary/view', async(req: any, res: any)=>{
//   const {groupId} = req.params
//   try{

//     const group = await prisma.group.findUnique({
//       where:{id:Number(groupId)},
//       //include:{
//         //TODO: may need to add relation to group for itinerary
//         //itinerary: true,
//        // user_id: true
//       //}

//     })
//     //if no group
//     if(!group){
//       return res.status(404).json({error: 'Group not found'})
//     }

//     //check for authorizaation

//     //check if user is in group
//     const itinerary = await prisma.itinerary.findUnique({
//       where: { id: group.itinerary_id},
//       include: {
//         activity: true, 
//         route: true,
//         creator: {
//           select: {
//             id: true, 
//             username: true
          
//           }
//         }

//       }
//     })
//     if(!itinerary){
//       return res.status(404).json({error: 'Itinerary not found'})
//     }
//     res.json(itinerary)
//   }catch(error){
//     console.error('Error fetching itinerary:', error)
//     res.status(500).json({error: 'Internal server error'})
//   }
// })




// add new users to an existing group

// groupRouter.post('/', async (req: any, res: any)=>{
//   try {
//     const{groupId, userIds} = req.body // desctructure with groupd and userIds
//     const addUsers = await prisma.group.update({
//       where: {
//         id: groupId, // find group by id
//       },
//       data: {
//         user_id: {
//           connect: userIds.map((id: number)=>({id})),
//         },
        
//       },
//       include: {
//         user_id:true 
      
//     }
//     })
//     res.status(200).json(addUsers)
//   }catch(error){
// res.status(500).json({error: 'Error adding users to group'})
//   }
// })



// //TODO: ROUTE IS NOT FINISHED
// //GET REQUEST FOR SPECIFIC GROUP
// groupRouter.get('/:id', async(req:any, res: any)=>{
//   try{
//     const{id} = req.params
// const groups = await prisma.group.findMany({
// include:{
//   user_id: true
// },
// })
// res.status(200).json(groups)
//   }catch(error){
//     res.status(500).json({error: 'Error fetching  group'})
//   }
// })

//GET  GROUPS WITH USERS
// groupRouter.get('/', async(req:any, res: any)=>{
//   try{
// const groups = await prisma.group.findMany({
// include:{
//   user_id: true
// },
// })
// res.status(200).json(groups)
//   }catch(error){
//     res.status(500).json({error: 'Error fetching groups'})
//   }
// })



//UPDATE


