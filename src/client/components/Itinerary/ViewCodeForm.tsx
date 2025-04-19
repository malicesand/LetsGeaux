import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewCodeForm = () => {
  const [viewCode, setViewCode] = useState('');
  const [itinerary, setItinerary] = useState<any>(null);
  const [error, setError] = useState<string>('');
const navigate = useNavigate()
  // Handle viewCode input change
  const handleViewCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewCode(e.target.value);
  };

  // Submit the form to fetch the itinerary based on the viewCode
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewCode) {
      setError('Please enter a view code.');
      return;
    }

    try {
      const response = await axios.get(`/api/itinerary/view/${viewCode}`);
      console.log('Fetching itinerary with viewCode:', viewCode);

      setItinerary(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching itinerary with the provided view code.');
      console.error('Error:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Enter View Code
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="View Code"
          value={viewCode}
          onChange={handleViewCodeChange}
          fullWidth
          required
        />

        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit">
            Fetch Itinerary
          </Button>
        </Box>
      </form>

      {itinerary && (
        <Box mt={4}>
          <Typography variant="h5">Itinerary Details</Typography>
          <Typography variant="h6">{itinerary.name}</Typography>
          <Typography variant="body1">{itinerary.notes}</Typography>
          <Typography variant="body2">{`Begin: ${new Date(itinerary.begin).toLocaleString()}`}</Typography>
          <Typography variant="body2">{`End: ${new Date(itinerary.end).toLocaleString()}`}</Typography>

          {/* Render Activities */}
          <Box mt={4}>
            <Typography variant="h6">Activities</Typography>
            {itinerary.activity && itinerary.activity.length > 0 ? (
              itinerary.activity.map((activity: any) => (
                <Box key={activity.id} mb={2}>
                  <Typography variant="h6">{activity.name}</Typography>
                  <Typography>{activity.description}</Typography>
                  <Typography>{activity.time}</Typography>
                  <Typography>{activity.date}</Typography>
                  <Typography>{activity.location}</Typography>
                  <Typography>{activity.phone}</Typography>
                  <Typography>{activity.address}</Typography>
                </Box>
              ))
            ) : (
              <Typography>No activities found for this itinerary.</Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};


export default ViewCodeForm;
