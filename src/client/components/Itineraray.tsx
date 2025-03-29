import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

//import { useParams } from 'react-router-dom';
import {Container,Typography, Box, List, ListItem, ListItemText, Button, TextField, Dialog, DialogContent, DialogActions, Modal  } from '@mui/material';
import axios from 'axios';
 import { DialogTitle }
from '@mui/material';


const Itinerary: React.FC = () => {
 
  const [activityName, setActivityName] = useState('');
  const [activityNotes, setActivityNotes] = useState('');
  const [itineraries, setItineraries] = useState<{ [date: string]: any[] }>({});



// Modal state
const [openModal, setOpenModal] = useState(false);
const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  

// Get selected dates from state
const { state } = useLocation();
const selectedDates = state?.selectedDates || [];

  


  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDates: any } = location.state || { selectedDates: [] };



   // Post itinerary data for the selected date
  const postItinerary = async () => {
    if (!selectedDate) {
      console.error('No date selected for itinerary.');
      return;
    }

    try {
      const itineraryData = {
        name: activityName,
        notes: activityNotes,
        begin: new Date(selectedDate).toISOString(),
        end: new Date(selectedDate).toISOString(),
        upVotes: 0,
        downVotes: 0,
        creator_id: 1,  
        member_id: 2,   
      };

      const response = await axios.post('/api/itinerary', itineraryData);
      console.log('Itinerary Created:', response.data);

      // Convert the selected date to YYYY-MM-DD format to use as key
      const dateKey = selectedDate.toISOString().split('T')[0];

      // Update the itineraries state with the new activity for the selected date
      setItineraries((prevItineraries) => {
        const updatedActivities = prevItineraries[dateKey] || [];
        return {
          ...prevItineraries,
          [dateKey]: [...updatedActivities, response.data], // Add new activity for the date
        };
      });

      // Close the modal after saving the activity
      handleCloseModal();

      // Clear form fields after submission
      setActivityName('');
      setActivityNotes('');
    } catch (err) {
      console.error('Error creating itinerary:', err);
    }
  };















  const generateDateRange = (startDate: Date, endDate: Date) => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    }
  
    return dates;
  };
  
  const dateRange = selectedDates.length === 2
  ? generateDateRange(selectedDates[0], selectedDates[1])
  : [];


  // Open modal with the clicked date
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setOpenModal(true);
  };
 // Close the modal
 const handleCloseModal = () => {
  setOpenModal(false);
  setSelectedDate(null); // Clear the selected date when closing the modal
};



  
  



  // Render activities for the selected date
  const renderActivitiesForSelectedDate = () => {
    if (!selectedDate) return null;
    
    const dateKey = selectedDate.toISOString().split('T')[0]; 
    const activitiesForSelectedDate = itineraries[dateKey] || [];

    return (
      <Box>
        {activitiesForSelectedDate.length > 0 ? (
          activitiesForSelectedDate.map((activity, index) => (
            <Box key={index} mb={2}>
              <Typography variant="body1">{activity.name}</Typography>
              <Typography variant="body2">{activity.notes}</Typography>
              <Typography variant="body2">Begin: {new Date(activity.begin).toLocaleString()}</Typography>
              <Typography variant="body2">End: {new Date(activity.end).toLocaleString()}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No activities for this date</Typography>
        )}
      </Box>
    );
  };


// Render selected dates with buttons
const renderSelectedDates = () => {
return selectedDates.map((date: Date, index: number) => (
  <Button
    key={index}
    variant="outlined"
    color="primary"
    onClick={() => handleDateClick(date)}
    sx={{ margin: 1 }}
  >
    {date.toLocaleDateString()}
  </Button>
));
};

return (
<Container>
      <Typography variant="h4" gutterBottom>
        Your Itinerary
      </Typography>

      <Box display="flex" justifyContent="center" flexDirection="column" my={2}>
        <Typography variant="h6" align="center">
          Selected Dates:
        </Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {renderSelectedDates()}
        </Box>
      </Box>

      {/* Modal for the selected date */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Selected Date</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {selectedDate ? `You clicked on: ${selectedDate.toLocaleDateString()}` : 'No date selected'}
          </Typography>

          {/* Form--- new itinerary for the selected date */}
          <TextField
            label="Activity Name"
            fullWidth
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
          />
          <TextField
            label="Activity Notes"
            fullWidth
            multiline
            rows={4}
            value={activityNotes}
            onChange={(e) => setActivityNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
          <Button onClick={postItinerary} color="primary">
            Save Activity
          </Button>
        </DialogActions>
      </Dialog>

      {/* show itineraries */}
      <Box>
        <Typography variant="h6">Itineraries</Typography>
        {Object.keys(itineraries).map((dateKey) => (
          <Box key={dateKey} mb={2}>
            <Typography variant="h6">{dateKey}</Typography>
            {itineraries[dateKey].map((activity, index) => (
              <Box key={index} mb={2}>
                <Typography variant="body1">{activity.name}</Typography>
                <Typography variant="body2">{activity.notes}</Typography>
                <Typography variant="body2">Begin: {new Date(activity.begin).toLocaleString()}</Typography>
                <Typography variant="body2">End: {new Date(activity.end).toLocaleString()}</Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Container>
  );
}
export default Itinerary;