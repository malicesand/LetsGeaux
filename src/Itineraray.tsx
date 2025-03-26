import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {Container,Typography, Box } from '@mui/material';

const Itinerary: React.FC = () => {
const { date } = useParams();
const[itinerary, setItinerary] = useState<any>(null);

useEffect(()=>{
  
})





return(
  <Container>
  <Typography variant="h4" gutterBottom>
    Itinerary for {date}
  </Typography>

  <Box my={2}>
    {itinerary ? (
      <div>
        <Typography variant="h6">Activity: {itinerary.name}</Typography>
        <Typography variant="body1">Description: {itinerary.description}</Typography>
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