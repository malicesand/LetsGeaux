
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {Alert, Box, Container, Typography} from '@mui/material'
import dayjs from 'dayjs';
const ViewItinerary = () => {
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

if (error) {
  
  return (
    <Container>
      <Alert severity="error">{error}</Alert>
    </Container>
  );
}

if (!itinerary) {
  return (
    <Container>
      <Typography variant="h6">Loading itinerary...</Typography>
    </Container>
  );
}

const sortedActivities = [...itinerary.activity].sort((a, b) => {
  const dateA = dayjs(`${a.date} ${a.time}`, 'YYYY-MM-DD h:mm A');
  const dateB = dayjs(`${b.date} ${b.time}`, 'YYYY-MM-DD h:mm A');
  return dateA.valueOf() - dateB.valueOf();
});

const groupedByDate: Record<string, any[]> = {};
for (const activity of sortedActivities) {
  if (!groupedByDate[activity.date]) {
    groupedByDate[activity.date] = [];
  }
  groupedByDate[activity.date].push(activity);
}



return (
  <Container>
    <Typography variant="h4" gutterBottom>
      {itinerary.name}
    </Typography>

    {itinerary.party?.name ? (
  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
    Party: {itinerary.party.name}
  </Typography>
) : (
  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
    No party associated with this itinerary.
  </Typography>
)}

    <Typography variant="body1" gutterBottom>
      Notes: {itinerary.notes}
    </Typography>

    <Typography variant="body1" gutterBottom>
      Start: {new Date(itinerary.begin).toLocaleString()}
    </Typography>
    <Typography variant="body1" gutterBottom>
      End: {new Date(itinerary.end).toLocaleString()}
    </Typography>

    <Box mt={4}>
      <Typography variant="h5">Activities</Typography>
      {/* {itinerary.activity && itinerary.activity.length > 0 ? ( */}
      {sortedActivities.length > 0 ? (

        // itinerary.activity.map((activity: any) => (
          // sortedActivities.map((activity: any) => (
            Object.entries(groupedByDate).map(([date, activities]) => (
              <Box key={date} mb={4}>
                <Typography variant="h6" gutterBottom>
                {new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}                </Typography>
                {activities.map((activity) => (
          <Box key={activity.id} mb={2} p={2} border="1px solid #ccc" borderRadius={2}>
            <Typography variant="body1">{activity.name}</Typography>
            <Typography>{activity.description}</Typography>
            <Typography>{activity.date} at {activity.time}</Typography>
            
            <Typography>{activity.location}</Typography>
            <Typography>{activity.phone}</Typography>
            <Typography>{activity.address}</Typography>
          </Box>
        ))}
        </Box>
            ))
      ) : (
        <Typography>No activities added yet.</Typography>
      )}
    </Box>
  </Container>
);
};


export default ViewItinerary;