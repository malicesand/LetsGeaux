import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from 'passport';
const prisma = new PrismaClient();

const itineraryRoute = express.Router();

itineraryRoute.get('/', async (req: any, res: any )=>{
try{
  const itineraries = await prisma.itinerary.findMany()
res.status(200).json(itineraries)
}catch(error){
res.status(500).json({error: 'Error fetching itinerary'})
}

})

itineraryRoute.post('/', async (req: any, res: any) =>{
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: "Unauthorized: No user data found" });
  }

  const{userId} = req.user
const {member_id, name, notes, begin, end, upVotes, downVotes} = req.body

if (!name || !begin || !end) {
  return res.status(400).json({ error: "Missing required fields" });
}


try{
  const newItinerary = await prisma.itinerary.create({
data: {
creator_id: userId, 
member_id:  Number(member_id), 
name, 
notes, 
begin: new Date(begin),
end: new Date(end),
upVotes: upVotes ?? 0,  
downVotes: downVotes ?? 0,

createdAt: new Date()
}

  })
res.status(201).json(newItinerary)
}catch(error){
res.status(500).json({error: 'Error creating itinerary'})
}

}) 

itineraryRoute.patch('/:id', async (req: any, res: any) => {
  const { id } = req.params;
  const { name, notes, begin, end, upVotes, downVotes } = req.body;

 

  try {
    const updateItinerary = await prisma.itinerary.update({
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

    res.status(200).json(updateItinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({ error: 'Error updating itinerary' });
  }
});

  itineraryRoute.delete('/:id', async (req: any, res: any) =>{
  const {id } = req.params
  try{
    const deleteIntinerary = await prisma.itinerary.delete({
      where: {
        id: Number(id)
      }
    })
    console.log(deleteIntinerary)
  res.status(200).json({message: `Itinerary ${id} has been successfully deleted`, deleteIntinerary})
  }catch(error){
  res.status(500).json({error: 'Error deleting itinerary'})
  }
  
  }) 


// // adding routes to make itinerary shareable 
// itineraryRoute.post('/:id/share', async(req: any, res: any)=>{
// const {id} = req.params //itinerary id
// const{groupId} = req.body // group id
// // if no groupid
// if(!groupId){
// return res.status(400).json({error: "Group id required"})
// }

//   try{
// const group = await prisma.group.findUnique({
//    where : { id: groupId},
//    //include: { users: true}
// })
// // if(!group){
// //   return res.status(404).json({error: 'Group not found'})
// // }

 
// //ok status for sharing itinerary with group
//     res.status(200).json({message: "Itinerary shared with group"})
//     //catch block for error
//   }catch(error){
//     res.status(500).json({error: 'Error sharing itinerary'})
//   } 
// })




export default itineraryRoute;