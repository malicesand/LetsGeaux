

// export default AddItinerary;
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
  Typography
} from '@mui/material';

import { user } from '../../../../types/models';

interface AddItineraryProps {
  user: user;
  partyId: number;
  partyName: string;
}

const AddItinerary: React.FC<AddItineraryProps> = ({ user, partyId, partyName }) => {
  const [open, setOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<any | null>(null);
  const navigate = useNavigate();

  //fetch all itineraries
  //if found setItinerary if set to null
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(`/api/itinerary?userId=${user.id}`);
        const allItineraries = response.data;

        const partyItinerary = allItineraries.find(
          (itinerary: any) => itinerary.partyId === partyId
        );

        if (partyItinerary) {
          setSelectedItinerary(partyItinerary);
        } else {
          setSelectedItinerary(null);
        }
      } catch (err) {
        console.error('Error fetching itineraries:', err);
      }
    };

    fetchItineraries();
  }, [user.id, partyId]);

  //when no itinerary exists, sen to calendar page
  const handleCreate = () => {
    navigate('/calendar', { state: { partyId } });
  };

//close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedItinerary(null);
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add a Shared Itinerary
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Travel Party Itinerary</DialogTitle>

        <DialogContent>
          <Typography gutterBottom>
            {selectedItinerary
              ? `A shared itinerary already exists for ${partyName}.`
              : `No shared itinerary yet. Create one for ${partyName}.`}
          </Typography>

          {selectedItinerary && (
            <Box mt={2}>
              <Typography variant="body1">Itinerary: {selectedItinerary.name}</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          {selectedItinerary ? (
            <Button
              onClick={() =>
                navigate(`/itinerary/${selectedItinerary.id}`, {
                  state: {
                    partyId,
                    partyName,
                    itineraryName: selectedItinerary.name,
                  },
                })
              }
              variant="contained"
              color="primary"
            >
              View Itinerary
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
