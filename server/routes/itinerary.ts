import express from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'
const prisma = new PrismaClient();

const itineraryRoute = express.Router();

itineraryRoute.get('/', async (req: any, res: any )=>{
 
try{
  const itineraries = await prisma.itinerary.findMany({
   where: {creatorId : req.user.id}
  })
res.status(200).json(itineraries)
}catch(error){
res.status(500).json({error: 'Error fetching itinerary'})
}

})

//added unique code
itineraryRoute.post('/', async (req: any, res: any) =>{
  //const {id} = req.user
const {creatorId, name, notes, begin, end, upVotes, downVotes} = req.body
//console.log(req.user)
const userExists = await prisma.user.findUnique({
  where: { id: creatorId },
});

if (!userExists) {
  return res.status(400).json({ error: 'Creator not found' });
}
if (!name || !begin || !end) {
  return res.status(400).json({ error: "Missing required fields" });
}
const viewCode = uuidv4().slice(0, 4)

try{
  const newItinerary = await prisma.itinerary.create({
data: {
creatorId, 
name, 
notes, 
begin: new Date(begin),
end: new Date(end),
upVotes: upVotes ?? 0,  
downVotes: downVotes ?? 0,
createdAt: new Date(), 
viewCode,
}

  })
res.status(201).json(newItinerary)
}catch(error){
res.status(500).json({error: 'Error creating itinerary', details: error.message})
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




  itineraryRoute.get('/view/:viewCode', async (req: any, res: any) => {
    const { viewCode } = req.params;
  
    try {
      // Fetch the itinerary based on the view code
      const itinerary = await prisma.itinerary.findUnique({
        where: {
          viewCode: viewCode, 
        },
        include: {
          activity: true,  
          route: true,     
          creator: {
            select: {
              id: true,
              
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
  


export default itineraryRoute;