import React, { useState, useEffect, } from 'react';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';




const GroupForm = () => { 
const [itinerary, setItineraryId] = useState('')
const [userIds, setUerIds] =useState('')
const [viewCode, setViewCode] = useState(null)
const [loading, setLoading] = useState<boolean>(false)
const [error, setError] = useState<string | null>(null)


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!viewCode) {
    setError('Please enter a view code.');
    return;
  }
  setLoading(true);
  setError(null);

  try{
        const response =  await axios.post(`/api/groups/itinerary/view/${viewCode}`)
        setItineraryId(response.data);
    
      }catch(error){
    console.error('Error fetching itinerary:', error)
    setError('Invalid view code or itinerary not found.');
  } finally {
    setLoading(false);
  }
    }
    
    
    
return(
<Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Enter View Code to Access Itinerary
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="View Code"
            variant="outlined"
            fullWidth
            value={viewCode}
            onChange={(e) => setViewCode(e.target.value)}
            margin="normal"
            disabled={loading}
          />
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </Box>
        </form>

        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {itinerary && (
          <Box mt={4}>
            <Typography variant="h5">Itinerary for Group ID: {itinerary.groupId}</Typography>
            <Typography variant="h6">Creator: {itinerary.creator.username}</Typography>
            <Typography variant="h6" mt={2}>Activities:</Typography>
            <ul>
              {itinerary.activity.map((activity: any) => (
                <li key={activity.id}>
                  <Typography variant="body1">
                    {activity.name} at {activity.location} on {activity.date}
                  </Typography>
                </li>
              ))}
            </ul>
            <Typography variant="h6" mt={2}>Route:</Typography>
            <Typography variant="body1">{itinerary.route}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default GroupForm;
// const createGroup = async() =>{
//   try{
//     const response =  await axios.post('/api', {

//     })

//   }catch(error){
// console.error('Error creating group:', error)
//   }
// }
// }

// const addUsers  = async () =>{
//   try{

//   }catch(error){
    
//   }