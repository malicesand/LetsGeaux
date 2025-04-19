
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {Container, Typography} from '@mui/material'
const viewItinerary = () => {
const [itinerary, setItinerary] = useState<any>(null);
  const [error, setError] = useState<string>('');
const {viewCode} = useParams();

// fetch itineraries attched to viewCode
//redirect from viewForm when code is added

  useEffect (()=>{
    const fetchItinerary = async() =>{
    try {
          const response = await axios.get(`/api/itinerary/view/${viewCode}`);
          console.log('Fetching itinerary with viewCode:', viewCode);
    
          setItinerary(response.data);
          setError('');
        } catch (err) {
          setError('Error fetching itinerary with the provided view code.');
          console.error('Error:', err);
        }
  
  }
if(viewCode){
  fetchItinerary();
}

},[viewCode])

//TODO: if no itinerary

return (
  <Container>
<Typography variant='h6'></Typography>
<Typography variant='body1'></Typography>
<Typography></Typography>

    {/*  TODO:
    itinerary.name
    itienarary.notes
    itinerary.activities
     */}


  </Container>
)
}
export default viewItinerary;