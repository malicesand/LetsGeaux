import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  TextField,
  MenuItem
} from '@mui/material';

import { user, itinerary } from '../../../../types/models';

interface AddItineraryProps {
  user: user;
  partyId: number;
  partyName: string;
  fetchItinerary: (params: number) => Promise<void>;
}

const AddItinerary: React.FC<AddItineraryProps> = ({ user, partyId, partyName, fetchItinerary }) => {
  const [open, setOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<itinerary | null>(null);
  const [itineraries, setItineraries] = useState<itinerary[]>([]);
  const navigate = useNavigate();
  const userId = user.id

  const fetchUserItineraries = async () => {
    setOpen(true);
    try {
      const response = await axios.get(`/api/itinerary?userId=${user.id}`);
      console.log(response.data[0].name)
      setItineraries(response.data);
      } catch (err) {
        console.error('Error fetching itineraries:', err);
      }
  }
  //when no itinerary exists, sen to calendar page
  const handleCreate = () => {
    navigate('/itinerary', { state: { partyId } });
  };

  //close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedItinerary(null);
  };

  const handleChoose = async() => {
    setOpen(false);
    const itineraryId = selectedItinerary.id;
    if (selectedItinerary) {
      try {
        const response = await axios.patch(`/api/itinerary/party/${itineraryId}`, {partyId: partyId});
        fetchItinerary(partyId);
      } catch (error) {
        console.error(`Failure: could not add Itinerary#${itineraryId} to Party${partyId}`)
      }
    }
  };
  // Key Down for Enter & Esc //
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLFormElement>,
      confirmAction: () => void,
      cancelAction: () => void
    ) => {
      console.log('pressed', e.key)
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmAction();
      }
      console.log('pressed', e.key)
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelAction();
      }
    };

  return (
    <Box>
      <Button variant="contained" onClick={() => fetchUserItineraries()}>
        Add a Shared Itinerary
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Travel Party Itinerary</DialogTitle>

        <DialogContent>
          <Typography gutterBottom>
            {`No shared itinerary yet for ${partyName}. Select Existing or Create New`}
          </Typography>
          <TextField
            fullWidth
            select
            label="Select an Itinerary"
            margin='normal'
            value={selectedItinerary?.id || ''}
            onChange={(e) => {
              const selected = itineraries.find(i => i.id === parseInt(e.target.value));
              setSelectedItinerary(selected || null);
            }}
            // sx={{ mt: 2 }}
            slotProps={{
              root: {
                sx: {
                  '& .MuiInputLabel-root': { // normal label
                  top: 23, 
                  left: 20
                },
                '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                  top: -9, // floating label
                },
                '& .MuiSelect-icon': {
                  right: 22, // caret
                },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  },
                },
              },
            }}
          >
            <MenuItem value="">-- Select --</MenuItem>
            {itineraries.map(itinerary => (
              <MenuItem key={itinerary.id} value={itinerary.id}>
                {itinerary.name}
              </MenuItem>
            ))}
          </TextField>
          {selectedItinerary && (
            <Box mt={2}>
              <Typography variant="body1">Itinerary: {selectedItinerary.name}</Typography>
              {selectedItinerary.viewCode && (
      <Typography variant="body2" sx={{ mt: 1 }}>
        View Code: <strong>{selectedItinerary.viewCode}</strong>
      </Typography>
    )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          {selectedItinerary ? (
            <Button
              onClick={() => handleChoose()}
              variant="contained"
              color="primary"
            >
              Select Itinerary 
            </Button>
          ) : (
            <Button onClick={handleCreate} variant="contained" color="primary">
              Create New Itinerary
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddItinerary;
