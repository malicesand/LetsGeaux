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
import { user, itinerary } from '../../../../types/models.ts';
// import Activity from '../Itinerary/NEWActivties.tsx';
import Activity from './Activities.tsx';
import AddItinerary from './AddItinerary.tsx';
import { useParams, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

interface ItineraryProps {
  user: user; 
  partyId: number;
  partyName: string;
}

const Itinerary: React.FC<ItineraryProps> = ({ user, partyId, partyName }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [itineraryName, setItineraryName] = useState('');
  const [itineraryNotes, setItineraryNotes] = useState('');
  const [itinerary, setItinerary] = useState<itinerary | null>(null);

  const [editingItinerary, setEditingItinerary] = useState<any | null>(null);
  const [error, setError] = useState<string>('');
  const location = useLocation();

 /*  const {
    itineraryName: passeditineraryName,
    selectedDates: passedDates
  } = location.state || {};

  const { id } = useParams(); */

  //when page laods, checks state of data when passed to another page
  //checks if state has begin and end date, then save it 
  //builds list of all dates 
  //if state has selectedDates, conver to objects
  /* useEffect(() => {
    console.log('dashItin')
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
  }, []); */
  
  // Function to add activity to itinerary
  const addActivityToItinerary = async (
    itineraryId: string,
    activityData: any,
    
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
/*   useEffect(() => {
    if (startDate && endDate) {
      const dates = eachDayOfInterval({ start: startDate, end: endDate });
      setSelectedDates(dates);
    }
  }, [startDate, endDate]); */

 /*  //when components loads, prefill name of itinerary
  useEffect(() => {

    if (passeditineraryName && !editingItinerary) {
      setItineraryName(passeditineraryName);
    }
  }, [passeditineraryName, editingItinerary]); */

  //* Get Itinerary *//
  useEffect(() => {
    fetchItinerary(partyId)
    // console.log(`user${user.id}`)
    // console.log(`itn creator${itinerary.creatorId}`)
  }, []);

  const fetchItinerary = async (partyId: number) => {
    // console.log(`Fetching itinerary`);
    try {
      const response = await axios.get(`/api/itinerary/party/${partyId}`);//postman verified
      // console.log(response.data)
      setItineraryName(response.data.name);
      setStartDate(response.data.begin)
      setEndDate(response.data.end)
      setItinerary({
        ...response.data,
        id: Number(response.data.id),
        creatorId: Number(response.data.creatorId)

      })
      // console.log(response.data.creatorId)
    } catch (error) {
      
      console.error(`Error occurred fetching party itinerary for party ${partyId}`)
    }
  };
  // TODO Handle edit button click 
  const handleEditClick = (itinerary: itinerary) => {
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
    // confirm deletion
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this itinerary?'
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/api/itinerary/${itineraryId}`);
      console.log(`deleted ${itineraryId}`)
      // console.log(response.data)
      setItinerary(null)
    
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
      setItinerary(prev => (
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
      <Box mt={4}>
        <Typography variant='h3'>Itinerary</Typography>
        {itinerary ? (
            <Card sx={{ mb: 2 }}>
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
              <CardActions>
                <Button
                  variant='contained'
                  
                  onClick={() => handleEditClick(itinerary)}
                >
                  Edit
                </Button>
                {user.id === itinerary.creatorId && (
                  <Button
                    variant='contained'
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
          
        ) : (
          <>
            <Typography variant='body1' sx={{ mt: 2}}>
              Your Party's Shared Itinerary will display here once it is created. 
            </Typography>
            <AddItinerary
              user={user}
              partyId={partyId}
              partyName={partyName}
            />
          </>
        )}
      </Box>
    </Container>
  );
};

export default Itinerary;
