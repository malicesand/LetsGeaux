import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Alert
} from '@mui/material';
import { eachDayOfInterval } from 'date-fns';
import axios from 'axios';
import { user } from '../../../../types/models.ts';
import Activity from './NEWActivties.tsx';
import { useParams, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

interface ItineraryProps {
  user: user;
}
// interface ItineraryProps {
//   itinerary: {
//     id: number;
//     name: string;
//     description: string;

//  };
//   user: {
//     id: number;
//     username: string;
//     email: string;
//     isVerified: boolean;
//     phoneNum: string;
//     isNotified: boolean;
//     googleId: string;
//     profilePic: string;
//     suggestionId: number;
//   };

// }
const Itinerary: React.FC<ItineraryProps> = ({ user }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [itineraryName, setItineraryName] = useState('');
  const [itineraryNotes, setItineraryNotes] = useState('');
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [editingItinerary, setEditingItinerary] = useState<any | null>(null);
  const [error, setError] = useState<string>('');
  const location = useLocation();

  const {
    partyId,
    partyName,
    itineraryName: passeditineraryName,
    selectedDates: passedDates
  } = location.state || {};

  const { id } = useParams();

  //when page laods, checks state of data when passed to another page
  //checks if state has begin and end date, then save it 
  //builds list of all dates 
  //if state has selectedDates, conver to objects
  useEffect(() => {
    if (location.state) {
      if (location.state.begin && location.state.end) {
        const begin = new Date(location.state.begin);
        const end = new Date(location.state.end);
        setStartDate(begin);
        setEndDate(end);
        setSelectedDates(eachDayOfInterval({ start: begin, end: end }));
      } else if (location.state.selectedDates?.length > 0) {
        const convertedDates = location.state.selectedDates.map((d: string) => new Date(d));
        setSelectedDates(convertedDates);
        setStartDate(convertedDates[0]);
        setEndDate(convertedDates[convertedDates.length - 1]);
      }
    }
  }, []);
  
  // Function to add activity to itinerary
  const addActivityToItinerary = async (
    itineraryId: string,
    activityData: any
  ) => {
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

  // Update selectedDates based on the startDate and endDate
  useEffect(() => {
    if (startDate && endDate) {
      const dates = eachDayOfInterval({ start: startDate, end: endDate });
      setSelectedDates(dates);
    }
  }, [startDate, endDate]);

  // Function to handle the itinerary form submission
  const handleSubmit = async () => {
    if (!itineraryName || selectedDates.length === 0) {
      setError('Please provide a name and select dates for the itinerary');
      return;
    }


    //create itinerary
    const itineraryData = {
      creatorId: user.id,
      name: itineraryName,
      notes: itineraryNotes,
      begin: selectedDates[0].toISOString(),
      end: selectedDates[selectedDates.length - 1].toISOString(),
      upVotes: 0,
      downVotes: 0,
      ...(partyId && { partyId })
    };
    // console.log("Submitting:", itineraryData);

    try {
      const response = await axios.post('/api/itinerary', itineraryData);

      const newItinerary = {
        ...response.data,
        message: `Itinerary created! View Itinerary with CODE: ${response.data.viewCode}`
      };

      setItineraries(prev => [...prev, newItinerary]);
      setItineraryName('');
      setItineraryNotes('');
      setError('');
    } catch (err) {
      setError('Error creating itinerary');
      console.error('Error creating itinerary:', err);
    }
  };

  //when components loads, prefill name of itinerary
  useEffect(() => {
    if (passeditineraryName && !editingItinerary) {
      setItineraryName(passeditineraryName);
    }
  }, [passeditineraryName, editingItinerary]);

  // Fetch existing itineraries
  useEffect(() => {
    console.log(partyId, 'partyId at itinerary');
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('/api/itinerary');
        setItineraries(response.data);
      } catch (err) {
        console.error('Error fetching itineraries:', err);
      }
    };

    fetchItineraries();
  }, []);

  // Handle edit button click
  const handleEditClick = (itinerary: any) => {
    setEditingItinerary(itinerary);
    setItineraryName(itinerary.name);
    setItineraryNotes(itinerary.notes);

    // Set start and end dates based on itinerary's begin and end
    const start = new Date(itinerary.begin);
    const end = new Date(itinerary.end);
    setStartDate(start);
    setEndDate(end);
  };

  // Handle delete of an itinerary, creator only
  const handleDelete = async (itineraryId: number, creatorId: number) => {
    if (user.id !== creatorId) {
      alert('Only the creator can delete this itinerary.');
      return;
    }
    // conirm deletion
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this itinerary?'
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/itinerary/${itineraryId}`);
      setItineraries(prev =>
        prev.filter(itinerary => itinerary.id !== itineraryId)
      );
    } catch (err) {
      console.error('Error deleting itinerary:', err);
    }
  };

  // Handle save changes on editing an itinerary
  const handleEditSubmit = async () => {
    if (!itineraryName || selectedDates.length === 0) {
      setError('Please provide a name and select dates for the itinerary');
      return;
    }
    //update itinerary
    const updatedItineraryData = {
      id: editingItinerary.id,
      creator_id: editingItinerary.creator_id,
      name: itineraryName,
      notes: itineraryNotes,
      begin: selectedDates[0].toISOString(),
      end: selectedDates[selectedDates.length - 1].toISOString(),
      upVotes: editingItinerary.upVotes,
      downVotes: editingItinerary.downVotes
    };

    try {
      const response = await axios.patch(
        `/api/itinerary/${editingItinerary.id}`,
        updatedItineraryData
      );
      setItineraries(prev =>
        prev.map(itinerary =>
          itinerary.id === editingItinerary.id ? response.data : itinerary
        )
      );
      setEditingItinerary(null);
      setItineraryName('');
      setItineraryNotes('');
      setStartDate(null);
      setEndDate(null);
      setError('');
    } catch (err) {
      setError('Error updating itinerary');
      console.error('Error updating itinerary:', err);
    }
  };

  return (
    <Container>
      {partyName && (
        <Typography variant='h6' align='center' color='secondary'>
          Party: {partyName}
        </Typography>
      )}

      {passeditineraryName && !editingItinerary && (
        <Typography variant='h6' align='center' color='primary'>
          Viewing: {passeditineraryName}
        </Typography>
      )}

      {error && <Typography color='error'>{error}</Typography>}

      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        my={2}
      ></Box>

      {startDate && endDate && (
        <Typography variant='h6' align='center' color='primary' mt={2}>
          Selected Range: {dayjs(startDate).format('MMMM D')} -{' '}
          {dayjs(endDate).format('MMMM D, YYYY')}
        </Typography>
      )}

      <TextField
        label='Itinerary Name'
        fullWidth
        value={itineraryName}
        onChange={e => setItineraryName(e.target.value)}
        sx={{ marginBottom: 2 }}
        required
      />

      <TextField
        label='Itinerary Notes'
        fullWidth
        value={itineraryNotes}
        onChange={e => setItineraryNotes(e.target.value)}
        multiline
        rows={4}
        sx={{ marginBottom: 2 }}
      />

      <Box display='flex' justifyContent='center' my={3}>
        {editingItinerary ? (
          <Button
            variant='contained'
            color='primary'
            onClick={handleEditSubmit}
          >
            Save Changes
          </Button>
        ) : (
          <Button variant='contained' color='primary' onClick={handleSubmit}>
            Save Itinerary
          </Button>
        )}
      </Box>

      <Box mt={4}>
        <Typography variant='h5'>Party Itineraries</Typography>
        {itineraries.map((itinerary, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant='h6'>{itinerary.name}</Typography>
              <Typography variant='body1'>{itinerary.notes}</Typography>
              <Typography variant='body2'>
                Begin: {dayjs(itinerary.begin).format('dddd, MMMM D, YYYY')}
              </Typography>
              <Typography variant='body2'>
                End: {dayjs(itinerary.end).format('dddd, MMMM D, YYYY')}
              </Typography>
              <Typography variant='caption' color='secondary'>
    View Code: {itinerary.viewCode}
  </Typography>
  
              {itinerary.message && (
                <Alert severity='success'>{itinerary.message}</Alert>
              )}
            </CardContent>
            <CardActions>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => handleEditClick(itinerary)}
              >
                Edit
              </Button>
              {user.id === itinerary.creatorId && (
                <Button
                  variant='contained'
                  color='error'
                  onClick={() =>
                    handleDelete(itinerary.id, itinerary.creatorId)
                  }
                >
                  Delete
                </Button>
              )}
            </CardActions>
            {user && (
  <Activity
    itineraryId={itinerary.id}
    addActivity={addActivityToItinerary}
    itineraryCreatorId={itinerary.creatorId}
    user={user}
    itineraryBegin={''}
    itineraryEnd={''}
  />
)}

          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Itinerary;
