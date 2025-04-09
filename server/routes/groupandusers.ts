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
res.status(500).json({message: 'Eror creating group'})
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


// add new users to an existing group
//UPDATE
groupRouter.post('/', async (req: any, res: any)=>{
  try {
    const{groupId, userIds} = req.body // desctructure with groupd and userIds
    const addUsers = await prisma.group.update({
      where: {
        id: groupId, // find group by id
      },
      data: {
        user_id: {
          connect: userIds.map((id: number)=>({id})),
        },
        
      },
      include: {
        user_id:true 
      
    }
    })

  }catch(error){
res.status(500).json({message: 'Error adding users to group:', error})
  }
})


//DELETE GROUP
groupRouter.delete('/', async(req:any, res: any)=>{
  try{

  }catch(error){
    res.status(500).json()
  }
} )







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