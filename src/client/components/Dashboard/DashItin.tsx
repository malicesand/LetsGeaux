import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  // Backdrop
} from '@mui/material';
import axios from 'axios';
import { user, itinerary } from '../../../../types/models.ts';
import Activity from './Activities.tsx';
import AddItinerary from './AddItinerary.tsx';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { PiPencil, PiTrashDuotone } from 'react-icons/pi';
import { useSnackbar } from 'notistack';

interface ItineraryProps {
  user: user; 
  partyId: number;
  partyName: string;
}

const Itinerary: React.FC<ItineraryProps> = ({ user, partyId, partyName }) => {
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [itineraryName, setItineraryName] = useState('');
  const [itineraryNotes, setItineraryNotes] = useState('');
  const [itinerary, setItinerary] = useState<itinerary | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [editingItinerary, setEditingItinerary] = useState<any | null>(null);
  const [error, setError] = useState<string>('');
  // const location = useLocation();
   //delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  //* Add Activity to Itinerary *//
  const addActivityToItinerary = async ( itineraryId: string, activityData: any) => {
    try {
      const response = await axios.post(
        `/api/itinerary/${itineraryId}/activity`,
        activityData
      );
      console.log('Activity added:', response.data);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  //* Get Itinerary *//
  useEffect(() => {
    fetchItinerary(partyId);
  }, []);

  const fetchItinerary = async (partyId: number) => {
    try {
      const response = await axios.get(`/api/itinerary/party/${partyId}`);
      setItineraryName(response.data.name);
      setStartDate(response.data.begin)
      setEndDate(response.data.end)
      setItinerary({
        ...response.data,
        id: Number(response.data.id),
        creatorId: Number(response.data.creatorId)
      });
    } catch (error) {
      console.error(`Error occurred fetching party itinerary for party ${partyId}`)
    }
  };

  // * Edit Itinerary * //
  const handleEditClick = (itinerary: itinerary) => {
    console.log(itinerary)
    navigate('/itinerary')
    setEditingItinerary(itinerary);
    setItineraryName(itinerary.name);
    setItineraryNotes(itinerary.notes);
  };

  // * Handle delete of an itinerary, creator only *//
  const handleDelete = async (itineraryId: number, creatorId: number) => {
    setDeleteDialogOpen(true);
    try {
      const response = await axios.delete(`/api/itinerary/${itineraryId}`);
      console.log(`deleted ${itineraryId}`)
      setDeleteDialogOpen(false);
      setItinerary(null);
      enqueueSnackbar('Itinerary deleted successfully!', {
        variant: 'success'})
    } catch (err) {
      console.error('Error deleting itinerary:', err);
    }
  };

  return (  
    <Container>
      <Box mt={4}>
        <Typography variant='h3'>Party Itinerary</Typography>
        {/* Show Itinerary or Button to create */}
        {itinerary ? (
          <Card sx={{ 
            position: 'relative',
            mb: 2,
            backgroundColor: '#C2A4F8',
            borderRadius: '24px',
            padding: 2,
            boxShadow: 'none',
            border: '4px solid black',
            fontWeight: 700
          }}>
            <CardContent>
              <Typography variant='h3'>{itinerary.name}</Typography>
              <Typography variant='body1'>{itinerary.notes}</Typography>
              <Typography variant='body2'>
                Begin: {dayjs(itinerary.begin).format('dddd, MMMM D, YYYY')}
              </Typography>
              <Typography variant='body2'>
                End: {dayjs(itinerary.end).format('dddd, MMMM D, YYYY')}
              </Typography>
            </CardContent>

            <Typography
              variant='caption'
              color='secondary'
              sx={{
                display: 'inline-block',
                backgroundColor: 'primary.main',
                color: 'black',
                px: 2,
                py: 1,
                borderRadius: '9999px',
                  border: '4px solid black',
                fontWeight: 700,
                fontSize: '0.75rem',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }}
            >
              View Code: {itinerary.viewCode}     
            </Typography>
      
            <CardActions>
              <Tooltip title='Edit Itinerary'>
                <IconButton onClick={() => handleEditClick(itinerary)}
                >
                  <PiPencil/>
                </IconButton>
              </Tooltip>
              {user.id === itinerary.creatorId && (
                <Tooltip title='Delete Itinerary'>
                  <IconButton
                    onClick={() =>
                      setDeleteDialogOpen(true)
                      
                    }
                  >
                    <PiTrashDuotone/>
                  </IconButton>
                </Tooltip>
              )}
            </CardActions>
            {user && (
              <Activity
                itineraryId={itinerary.id}
                addActivity={addActivityToItinerary}
                itineraryCreatorId={itinerary.creatorId}
                user={user}
                itineraryBegin={dayjs(itinerary.begin).format('YYYY-MM-DD')}
                                itineraryEnd={dayjs(itinerary.end).format('YYYY-MM-DD')}
              />
            )}
          </Card>
        ) : (
          <>
            <Typography variant='body1' sx={{ mt: 2}}>
              Your Party's Shared Itinerary will display here once it is created. 
            </Typography>
            {/* Button -> Modal -> redirect /itinerary */}
            <AddItinerary
              user={user}
              partyId={partyId}
              partyName={partyName}
              fetchItinerary={fetchItinerary}
            />
          </>
        )}
      </Box>
      <>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Itinerary?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this itinerary?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'black' }}
          >
            Cancel
          </Button>
          <Button onClick={() => handleDelete(itinerary.id, user.id)} sx={{ color: 'black' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </>
    </Container>
  );
};

export default Itinerary;
