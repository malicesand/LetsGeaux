import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { group, groupEnd } from 'node:console';
const groupRouter = express.Router();
const prisma = new PrismaClient();


//POST 
// create a group
groupRouter.post('/', async (req:any, res: any)=>{
try{
  const { userIds, itineraryId, activityId} = req.body
const newGroup = await prisma.group.create({
data:{
  itinerary_id: itineraryId,
  activity_id: activityId,
  user_id:{
  connect: userIds.map((id: number) =>({id})),
},
},
include: {
  user_id: true,
}
})
res.status(201).json(newGroup)
}catch(error){
res.status(500).json({error: 'Eror creating group'})
}
})





//POST //create group of existing users
groupRouter.post('/', async (req:any, res:any)=>{
try{
  const {userIds, itineraryId, activityId} = req.body
const group = await prisma.group.create({
  data: {
    itinerary_id: itineraryId,
    //TODO: add to schema--- prisma wants activityId
    activity_id: activityId,
    user_id:{
      connect: userIds.map((id:number)=>({id})),
  },
},

  include: {
    user_id: true
  }
})

res.status(201).json(group)
}catch(error){
res.status(500).json({error: 'Error creating group'})
}
})


// inviting user to view itinerary(view only)
//using email or url to send jackbox code


groupRouter.get('/:groupId/itinerary/view', async(req: any, res: any)=>{
  const {groupId} = req.params
  try{

    const group = await prisma.group.findUnique({
      where:{id:Number(groupId)},
      //include:{
        //TODO: may need to add relation to group for itinerary
        //itinerary: true,
       // user_id: true
      //}

    })
    //if no group
    if(!group){
      return res.status(404).json({error: 'Group not found'})
    }

    //check for authorizaation

    //check if user is in group
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: group.itinerary_id},
      include: {
        activity: true, 
        route: true,
        creator: {
          select: {
            id: true, 
            username: true
          
          }
        }

      }
    })
    if(!itinerary){
      return res.status(404).json({error: 'Itinerary not found'})
    }
    res.json(itinerary)
  }catch(error){
    console.error('Error fetching itinerary:', error)
    res.status(500).json({error: 'Internal server error'})
  }
})




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
groupRouter.get('/', async(req:any, res: any)=>{
  try{
const groups = await prisma.group.findMany({
include:{
  user_id: true
},
})
res.status(200).json(groups)
  }catch(error){
    res.status(500).json({error: 'Error fetching groups'})
  }
})



//UPDATE




//DELETE GROUP
groupRouter.delete('/', async(req:any, res: any)=>{
  const { id} = req.params
  try{
    const deleteGroup = await prisma.group.delete({
where: {
  id: Number(id),
}
    })
    res.status(200).json({deleteGroup});
  }catch(error){
    res.status(500).json({message:'Error deleting group:', error})
  }
})


const viewCodeStore = new Map<string, number>(); 
function generateViewCode() {
  return Math.random().toString(36).substring(2, 8); 
}


groupRouter.get('/:view/itinerary/view', async(req: any, res: any)=>{
  const {groupId} = req.params
  try{

    const group = await prisma.group.findUnique({
      where:{id:Number(groupId)},
      //include:{
        //TODO: may need to add relation to group for itinerary
        //itinerary: true,
       // user_id: true
      //}

    })
    //if no group
    if(!group){
      return res.status(404).json({error: 'Group not found'})
    }

    //check for authorizaation

    //check if user is in group
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: group.itinerary_id},
      include: {
        activity: true, 
        route: true,
        creator: {
          select: {
            id: true, 
            username: true
          
          }
        }

      }
    })
    if(!itinerary){
      return res.status(404).json({error: 'Itinerary not found'})
    }
    res.json(itinerary)
  }catch(error){
    console.error('Error fetching itinerary:', error)
    res.status(500).json({error: 'Internal server error'})
  }
})






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
export default groupRouter;