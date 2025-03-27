import React, { use, useEffect, useState } from 'react';
//import axios from 'axios';
import { useParams } from 'react-router-dom';
import {Container,Typography, Box } from '@mui/material';
import axios from 'axios';

const Itinerary: React.FC = () => {
//const { date } = useParams();
const[itinerary, setItinerary] = useState<any>(null);



//GET
const getItinerary = async() =>{
  try{
    const response = axios.get('/api/itinerary');
    
  }catch(err){
    console.error("Error fecthing itinerary:", err)
  }
}

// hook -- unction to perform side effects
useEffect(()=>{
  getItinerary();
})
//POST

const postItinerary = async() =>{
  try{
  const response = axios.post('/api/itinerary');

}catch(err){
  console.error("Error fetching itinerary:", err)
}
}


//PATCH
const patchtItinerary = async(id: number, updateData: any) =>{
  try{
  const ressponse = axios.patch(`/api/itinerary/${id}`);

}catch(err){
  console.error("Error updating itinerary:", err)
}
}


//DELETE

const deleteItinerary = async(id: number) =>{
  try{
  const response = axios.delete(`/api/itinerary/${id}`);

}catch(err){
  console.error("Error deleting itinerary:", err)
}
}


return(
  <Container>
  <Typography variant="h4" gutterBottom>
    Itinerary Time!
  </Typography>

  <Box my={2}>
    {itinerary ? (
      <div>
        <Typography variant="h6">Activity: {itinerary.name}</Typography>
        <Typography variant="body1">Description: {itinerary.notes}</Typography>
        {/* Render more itinerary details here */}
      </div>
    ) : (
      <Typography variant="h6">Loading itinerary...</Typography>
    )}
  </Box>
</Container>
);
}
export default Itinerary;