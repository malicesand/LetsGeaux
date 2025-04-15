


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Box,
  Typography
} from '@mui/material';

import { user } from '../../../../types/models';

interface AddItineraryProps {
  user: user;
  partyId: number;
  partyName: string;
}

const AddItinerary: React.FC<AddItineraryProps> = ({ user, partyId, partyName }) => {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(`/api/itinerary?userId=${user.id}`);
        setItineraries(response.data);
      } catch (err) {
        console.error('Error fetching itineraries:', err);
      }
    };

    fetchItineraries();
  }, [user.id]);

  const handleChoose = () => {
    if (selectedItinerary) {
      navigate(`/itinerary/${selectedItinerary.id}`,{
        state: {
          partyId,
          partyName,
          itineraryName: selectedItinerary.name
        }
      });
    }
  };

  useEffect(()=>{
    console.log('party', partyId)
    console.log(typeof partyId)
  })
  const handleCreate = (e: React.MouseEvent, partyId: number) => {
    e.preventDefault();
    navigate('/itinerary', { state: { partyId } });
  };
  

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add a Shared Itinerary
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Travel Party Itinerary</DialogTitle>

        <DialogContent>
          <Typography gutterBottom>Choose an existing itinerary or create a new one for the party <strong>{partyName}</strong>.</Typography>

          <TextField
            fullWidth
            select
            label="Select an Itinerary"
            value={selectedItinerary?.id || ''}
            onChange={(e) => {
              const selected = itineraries.find(i => i.id === parseInt(e.target.value));
              setSelectedItinerary(selected || null);
            }}
            sx={{ mt: 2 }}
          >
            <MenuItem value="">-- Select --</MenuItem>
            {itineraries.map(itinerary => (
              <MenuItem key={itinerary.id} value={itinerary.id}>
                {itinerary.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleChoose} disabled={!selectedItinerary}>
            Choose
          </Button>
          <Button onClick={(e) => handleCreate(e, partyId)} variant="contained" color="primary">
            Create New Itinerary
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddItinerary;
