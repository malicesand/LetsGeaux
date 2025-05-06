import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Card, CardContent, Typography, Divider, Box } from '@mui/material';
import axios from 'axios';
import { useItinerary } from './ItineraryContext';

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
  const { setItineraryId } = useItinerary();

  useEffect(() => {
    // Fetch itineraries from the server
    axios.get('/api/itinerary')
      .then(res => setItineraries(res.data))
      .catch(err => console.error('Error fetching itineraries:', err));
  }, []);

  useEffect(() => {
    // Fetch activities when an itinerary is selected
    if (selectedItineraryId !== null) {
      axios.get(`/api/activity/${selectedItineraryId}`)
        .then(res => setActivities(res.data))
        .catch(err => console.error('Error fetching activities:', err));
    }
  }, [selectedItineraryId]);

  const groupActivitiesByDate = (activities: any[]) => {
    return activities.reduce((acc: { [key: string]: any[] }, activity) => {
      const date = activity.date
        ? new Date(activity.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        : 'Unscheduled';
      if (!acc[date]) acc[date] = [];
      acc[date].push(activity);
      return acc;
    }, {});
  };

  const handleConfirm = () => {
    if (startActivity && endActivity) {
      onSelect(startActivity, endActivity);
      setItineraryId(selectedItineraryId);  // Save selected itineraryId to context and localStorage
      onClose();
    }
  };

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Your Itinerary & Activities</DialogTitle>
      <DialogContent>
        {!selectedItineraryId ? (
          <>
            <Typography variant="h6" gutterBottom>Select an Itinerary:</Typography>
            <Grid container spacing={2} justifyContent="center">
              {itineraries.map((itinerary) => (
                <Grid item xs={12} sm={6} md={4} key={itinerary.id}>
                  <Card
                    onClick={() => {
                      setSelectedItineraryId(itinerary.id);
                      setItineraryId(itinerary.id);  // Update context when itinerary is selected
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <CardContent>
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
            {Object.entries(groupedActivities).map(([date, acts]) => (
              <div key={date}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>{date}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {acts.map((activity: any) => (
                    <Grid item xs={12} sm={6} md={4} key={activity.id}>
                      <Card
                        onClick={() => {
                          if (!startActivity) setStartActivity(activity.location);
                          else if (!endActivity && activity.location !== startActivity)
                            setEndActivity(activity.location);
                        }}
                        sx={{
                          cursor: 'pointer',
                          border: startActivity === activity.location || endActivity === activity.location
                            ? '2px solid #3200FA'
                            : '1px solid #ccc'
                        }}
                      >
                        <CardContent>
                          <Typography variant="h4">{activity.name}</Typography>
                          <Typography variant="body1" color="textSecondary">{activity.location}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Box justifyContent='center' sx={{ display: 'flex', gap: 1, }}>
          {selectedItineraryId && (
            <Button color="black" onClick={() => setSelectedItineraryId(null)}>
              Back
            </Button>
          )}
          <Button color="black" onClick={onClose}>Cancel</Button>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Button
            onClick={handleConfirm}
            disabled={!startActivity || !endActivity}
            variant="contained"
            color="black"
          >
            Confirm Route
          </Button>
        </Box>
      </DialogActions>
    </Dialog >
  );
};

export default MapsModal;