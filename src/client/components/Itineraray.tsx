import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

//import { useParams } from 'react-router-dom';
import {Container,Typography, Box, List, ListItem, ListItemText, Button, TextField, Dialog, DialogContent  } from '@mui/material';
import axios from 'axios';
 import { DialogTitle }
from '@mui/material'


const Itinerary: React.FC = () => {
//const { date } = useParams();
const { state } = useLocation();

const[itinerary, setItinerary] = useState<any>(null);
const selectedDates = state?.selectedDates || [];
const [isModalOpen, setIsModalOpen] = useState(false)
const [activityName, setActivityName] = useState('');
const[activityNotes, setActivityNotes] = useState('')

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

const handleOpenModal = () => setIsModalOpen(true)
const handleCloseModal = () => setIsModalOpen(false)




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
    {itinerary ? (
      <div>
        <Typography variant="h6">Activity: {itinerary.name}</Typography>
        <Typography variant="body1">Description: {itinerary.notes}</Typography>
      </div>
    ) : (
      <Typography variant="h6">Loading itinerary...</Typography>
      
    )}
  </Box>

    {/*  Add Modal */}
    <Dialog open={isModalOpen} onClose={handleCloseModal}>

{/* <DialogTitle component="h6" align="center">Add Activity</DialogTitle> */}
    <DialogContent>
      {/* <TextField
      autoFocus
      margin="Activit Name"
      fullWidth
      value={ativityName}
      onChange={(e)=> setActivityName(e.target.value)}
      
      </TextField>
       <TextField
            margin="dense"
            label="Activity Notes"
            fullWidth
            multiline
            rows={4}
            value={activityNotes}
            onChange={(e) => setActivityNotes(e.target.value)}
      
      */}
    </DialogContent>
        {/* <DialogActions>
        <Button onclick={handleCloseModal} color="secondary">
        Cancel
        </Button>
        <Button onclick={handleSaveActivity} color="primary">
        Save
        </Button>
        </DialogActions>
         */}
</Dialog>



  <Box my={3}>
        {selectedDates.length > 0 ? (
          <div>
            <Typography variant="h6" color="primary" gutterBottom>
              Selected Dates:
            </Typography>
            <List>
              {selectedDates.map((date: any, index: number) => (
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
              {/* add activity button */}
  <Box>
    <Button variant="contained" color="primary" onClick={()=> setIsModalOpen(true)}>Add Activity</Button>
  </Box>
{/* add activities */}


<TextField>
  autofocus
  margin="dense"
  label="Activity Name"
  fullWidth
  value={activityName}
  {/* onChange={(e)=> setActivityName(e.target.value) } */}
</TextField>


</Container>
);
}
export default Itinerary;