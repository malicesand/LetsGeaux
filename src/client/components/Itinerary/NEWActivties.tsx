import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Card,
  CardActions,
  CardContent
} from '@mui/material';
import axios from 'axios';
import { user } from '../../../../types/models';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

interface Activity {
  id: string;
  name: string;
  description: string;
  time: string;
  date: string;
  location: string;
  image: string;
  phone: string;
  address: string;
  itineraryId: string;
  creatorId?: string;
}

interface Props {
  itineraryId: string;
  itineraryCreatorId: number;
  user: user;
  addActivity: (itineraryId: string, activityData: any) => Promise<void>;
  itineraryBegin: string;
  itineraryEnd: string;
}

const Activity: React.FC<Props> = ({
  itineraryId,
  itineraryCreatorId,
  addActivity,
  user,
  itineraryBegin,
  itineraryEnd
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    time: '',
    date: '',
    location: '',
    image: '',
    phone: '',
    address: '',
    itineraryId: itineraryId
  });
  const [open, setOpen] = useState(false); // Modal open state
  const [error, setError] = useState<string | null>(null); // Error handling
  const [message, setMessage] = useState<string>(''); // Success message

  const sortedActivities = [...activities].sort((a, b) => {
    const dateTimeA = dayjs(`${a.date} ${a.time}`, 'MMMM D, YYYY h:mm A').toDate();
    const dateTimeB = dayjs(`${b.date} ${b.time}`, 'MMMM D, YYYY h:mm A').toDate();
    return dateTimeA.getTime() - dateTimeB.getTime();
  });
  
  

  // Fetch activities when the component mounts
  useEffect(() => {
    const getActivities = async () => {
      try {
        const response = await axios.get(`/api/activity/${itineraryId}`);
        console.log('Fetched activities:', response.data);
        if (response.data && Array.isArray(response.data)) {
          setActivities(response.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Error fetching activities.');
      }
    };
    getActivities();
  }, [itineraryId]);

  //form handler to update state when user types into input fields
  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: any }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  // create new actvities
  const postActivity = async () => {
    try {
      const response = await axios.post('/api/activity', formData);
      setActivities(prevActivities => [...prevActivities, response.data]);
      resetForm();
      setOpen(false);
      setMessage('Activity added successfully!');
    } catch (err: any) {
      console.error(
        'Error creating activity:',
        err.response?.data || err.message
      );
      setError('Error creating activity.');
    }
  };

  //edit activities
  const updateActivity = async () => {
    try {
      const updatedActivity = { ...formData };
      const response = await axios.patch(
        `/api/activity/${formData.id}`,
        updatedActivity
      );
      setActivities(prevActivities =>
        prevActivities.map(activity =>
          activity.id === formData.id ? response.data : activity
        )
      );
      resetForm();
      setOpen(false); // Close modal after updating activity
      setMessage('Activity updated successfully!');
    } catch (err) {
      console.error('Error updating activity:', err);
      setError('Error updating activity.');
    }
  };

  // delete activities
  const deleteActivity = async (id: string) => {
    try {
      await axios.delete(`/api/activity/${id}`);
      setActivities(activities.filter(activity => activity.id !== id));
      setMessage('Activity deleted successfully!');
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('Error deleting activity.');
    }
  };

  //reset/clear form
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      time: '',
      date: '',
      location: '',
      image: '',
      phone: '',
      address: '',
      itineraryId: itineraryId
    });
  };

  //function when update button is clicked
  const handleUpdateClick = (activity: Activity) => {
    setFormData({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      time: activity.time,
      date: activity.date,
      location: activity.location,
      image: activity.image,
      phone: activity.phone,
      address: activity.address,
      itineraryId: activity.itineraryId
    });
    setOpen(true); // Open modal to edit activity
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true); // Open modal to create new activity
  };

  const handleClose = () => {
    setOpen(false); // Close modal
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      updateActivity(); // Update activity if it has an id
    } else {
      postActivity(); // Otherwise, create a new activity
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Box mb={4}>
          <Button variant='contained' color='primary' onClick={handleOpen}>
            Add Activity
          </Button>

          {/* Modal for adding/editing activity */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              {formData.id ? 'Update Activity' : 'Create Activity'}
            </DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  label='Activity Name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  margin='normal'
                />
                <TextField
                  label='Description'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  margin='normal'
                />
                <DatePicker
                  label='Activity Date'
                  value={formData.date ? new Date(formData.date) : null}
                  onChange={newDate => {
                    if (newDate) {
                      setFormData(prev => ({
                        ...prev,
                        date: dayjs(newDate).format('MMMM D, YYYY')
                      }));
                    }
                  }}
                  minDate={new Date(itineraryBegin)}
                  maxDate={new Date(itineraryEnd)}
                  slotProps={{
                    textField: { fullWidth: true, margin: 'normal' }
                  }}
                />

                <TimePicker
                  label='Activity Time'
                  value={
                    formData.time
                      ? dayjs(
                          `1970-01-01 ${formData.time}`,
                          'YYYY-MM-DD h:mm A'
                        ).toDate()
                      : null
                  }
                  onChange={newTime => {
                    if (newTime) {
                      const timeString = dayjs(newTime).format('h:mm A');
                      setFormData(prev => ({
                        ...prev,
                        time: timeString
                      }));
                    }
                  }}
                  ampm
                  slotProps={{
                    textField: { fullWidth: true, margin: 'normal' }
                  }}
                />

                <TextField
                  label='Location'
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  margin='normal'
                />
                <TextField
                  label='Image URL'
                  name='image'
                  value={formData.image}
                  onChange={handleChange}
                  fullWidth
                  margin='normal'
                />
                <TextField
                  label='Phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  margin='normal'
                />
                <TextField
                  label='Address'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  margin='normal'
                />
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    color='primary'
                    sx={{ color: 'black' }}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' color='primary' sx={{ color: 'black' }}>
                    {formData.id ? 'Update Activity' : 'Add Activity'}
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </Box>

        {error && (
          <Snackbar open autoHideDuration={3000}>
            <Alert severity='error'>{error}</Alert>
          </Snackbar>
        )}
        {message && (
          <Snackbar open autoHideDuration={3000}>
            <Alert severity='success'>{message}</Alert>
          </Snackbar>
        )}

        <Box>
          <Typography variant='h5' gutterBottom>
            Activities List
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {sortedActivities.map(activity => (
              <Box key={activity.id} sx={{
                width: 300,
                minHeight: 300, 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <Card
                  sx={{
                    backgroundColor: '#A684FF',
                    padding: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant='h6'>{activity.name}</Typography>
                    <Typography>{activity.description}</Typography>
                    <Typography>{activity.time}</Typography>
                    <Typography>{activity.date}</Typography>
                    <Typography>{activity.location}</Typography>
                    <Typography>{activity.phone}</Typography>
                    <Typography>{activity.address}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={() => handleUpdateClick(activity)}
                      variant='outlined'
                      color='secondary'
                      sx={{ color: 'black' }}
                    >
                      Edit
                    </Button>
                    {user.id === itineraryCreatorId && (
                      <Button
                        onClick={() => {
                          const confirmDelete = window.confirm(
                            'Are you sure you want to delete this activity?'
                          );
                          if (confirmDelete) {
                            deleteActivity(activity.id);
                          }
                        }}
                        variant='outlined'
                        color='primary'
                        sx={{ color: 'black' }}
                      >
                        Delete
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default Activity;
