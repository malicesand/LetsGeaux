import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Card, CardContent, Typography, Grid
} from '@mui/material';
import axios from 'axios';

interface MapsModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (start: string, end: string) => void;
}

const MapsModal: React.FC<MapsModalProps> = ({ open, onClose, onSelect }) => {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<number | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [startActivity, setStartActivity] = useState<string | null>(null);
  const [endActivity, setEndActivity] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/itinerary')
      .then(res => setItineraries(res.data))
      .catch(err => console.error('Error fetching itineraries:', err));
  }, []);

  useEffect(() => {
    if (selectedItineraryId !== null) {
      axios.get(`/api/activity/${selectedItineraryId}`)
        .then(res => setActivities(res.data))
        .catch(err => console.error('Error fetching activities:', err));
    }
  }, [selectedItineraryId]);

  const handleConfirm = () => {
    if (startActivity && endActivity) {
      onSelect(startActivity, endActivity);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Your Itinerary & Activities</DialogTitle>
      <DialogContent>
        {!selectedItineraryId ? (
          <>
            <Typography variant="h6" gutterBottom>Select an Itinerary:</Typography>
            <Grid container spacing={2}>
              {itineraries.map((itinerary) => (
                <Grid item xs={12} sm={6} md={4} key={itinerary.id}>
                  <Card onClick={() => setSelectedItineraryId(itinerary.id)} sx={{ cursor: 'pointer' }}>
                    <CardContent>
                      {console.log(itinerary.name)}
                      <Typography variant="h5">{itinerary.name}</Typography>
                      <Typography variant="body1" color="black">{itinerary.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>Select Start and End Activities:</Typography>
            <Grid container spacing={2}>
              {activities.map((activity: any) => (
                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                  <Card
                    onClick={() => {
                      if (!startActivity) setStartActivity(activity.address);
                      else if (!endActivity && activity.address !== startActivity) setEndActivity(activity.address);
                    }}
                    sx={{
                      cursor: 'pointer',
                      border: startActivity === activity.address || endActivity === activity.address
                        ? '2px solid #3200FA'
                        : '1px solid #ccc'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h4">{activity.name}</Typography>
                      <Typography variant="body1" color="textSecondary">{activity.address}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {selectedItineraryId && (
          <Button color='black' onClick={() => setSelectedItineraryId(null)}>Back to Itineraries</Button>
        )}
        <Button color='black' onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} disabled={!startActivity || !endActivity} variant="contained" color="black">
          Confirm Route
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapsModal;