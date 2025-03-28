import React, { use, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

//import axios from 'axios';
import { useParams } from 'react-router-dom';
import {Container,Typography, Box } from '@mui/material';
import axios from 'axios';
import { List, ListItem, ListItemText } from '@mui/material';


const Itinerary: React.FC = () => {
//const { date } = useParams();
const { state } = useLocation();

const[itinerary, setItinerary] = useState<any>(null);
const selectedDates = state?.selectedDates || [];


//GET
const getItinerary = async() =>{
  try{
    const response = axios.get('/api/itinerary');
    
  }catch(err){
    console.error("Error fecthing itinerary:", err)
  }
}

// hook -- function to perform side effects
useEffect(()=>{
  if(selectedDates.length > 0 ){
  getItinerary();
  }
},[selectedDates])
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
  const response = axios.patch(`/api/itinerary/${id}`);

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
    Itinerary
  </Typography>

  <Box my={2}>
  {/* {selectedDates.length > 0 && (
  <Typography variant="h6" color="primary">
    Selected Dates: {selectedDates.map((date: { toLocaleDateString: () => any; }) => date.toLocaleDateString()).join(", ")}
  </Typography>
)} */}






    {itinerary ? (
      <div>
        <Typography variant="h6">Activity: {itinerary.name}</Typography>
        <Typography variant="body1">Description: {itinerary.notes}</Typography>
        {/* willRender more itinerary details here */}
      </div>
    ) : (
      <Typography variant="h6">Loading itinerary...</Typography>
      
    )}




  </Box>
  <Box my={3}>
        {selectedDates.length > 0 ? (
          <div>
            <Typography variant="h6" color="primary" gutterBottom>
              Selected Dates:
            </Typography>
            <List>
              {selectedDates.map((date: any, index: any) => (
                <ListItem key={index}>
                  <ListItemText primary={date.toLocaleDateString()} />
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          <Typography variant="body1">No dates selected.</Typography>
        )}
              </Box>




</Container>
);
}
export default Itinerary;