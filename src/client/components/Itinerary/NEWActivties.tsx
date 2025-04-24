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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import IconButton from '@mui/material/IconButton';
import { PiTrash } from "react-icons/pi";
import { PiPencilLine } from "react-icons/pi";
import Fab from '@mui/material/Fab';
import { useSnackbar } from 'notistack';
import { PiPlusBold } from "react-icons/pi";
import Tooltip from '@mui/material/Tooltip';

//defines structure of activity object
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
//type check(typescript) for props passed to Ativity component
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

  //list of activities
  const [activities, setActivities] = useState<Activity[]>([]);
  
  //input vlaues for the create/edit form
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
  //controls the ativity modal
  const [open, setOpen] = useState(false); 
  
//stores error message
  const [error, setError] = useState<string | null>(null); // Error handling
  // const [message, setMessage] = useState<string>(''); // Success message
  
  //delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  //stores the activity of delete
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null
  );
//copies activity and sortd ativity by time and date
  const sortedActivities = [...activities].sort((a, b) => {
    const dateTimeA = dayjs(
      `${a.date} ${a.time}`,
      'MMMM D, YYYY h:mm A'
    ).toDate();
    const dateTimeB = dayjs(
      `${b.date} ${b.time}`,
      'MMMM D, YYYY h:mm A'
    ).toDate();
    return dateTimeA.getTime() - dateTimeB.getTime();
  });
  const { enqueueSnackbar } = useSnackbar();

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
      enqueueSnackbar('Activity added successfully!', { variant: 'success' });
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
      enqueueSnackbar('Activity updated successfully!', { variant: 'success' });

    } catch (err) {
      console.error('Error updating activity:', err);
      setError('Error updating activity.');
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
  // caled when trash can is clicked
  const handleOpenDeleteDialog = (activity: Activity) => {
    setActivityToDelete(activity);
    setDeleteDialogOpen(true);
  };
//closes and clears ativity
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setActivityToDelete(null);
  };
//removes deleted acitivty
  const handleConfirmDelete = async () => {
    if (!activityToDelete) return;

    try {
      await axios.delete(`/api/activity/${activityToDelete.id}`);
      setActivities(prev => prev.filter(a => a.id !== activityToDelete.id));
      enqueueSnackbar('Activity deleted successfully!', { variant: 'success' });

    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('Error deleting activity.');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Box mb={4}>
          <Dialog open={open} onClose={handleClose}
          PaperProps={{
            sx: {
              backgroundColor: '#A684FF', 
            }
          }}>
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
                  required
                  InputLabelProps={{
                    sx: {
                      top: -6,
                    }
                  }}
        
                />
                <TextField
                  label='Description'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  margin='normal'
                  required
                  InputLabelProps={{
                    sx: {
                      top: -6,
                    }
                  }}
        
                />
                <DatePicker
                  label='Activity Date'
                  value={
                    formData.date ? dayjs(formData.date, 'MMMM D, YYYY') : null
                  }
                  onChange={newDate => {
                    if (newDate) {
                      setFormData(prev => ({
                        ...prev,
                        date: newDate.format('MMMM D, YYYY')
                      }));
                    }
                  }}
                  minDate={dayjs(itineraryBegin)}
                  maxDate={dayjs(itineraryEnd)}
                  slotProps={{
                    actionBar: {
                      sx: {
                        '& .MuiButton-textPrimary': {
                          color: 'black',
                        }
                      }
                    },
                    textField: { fullWidth: true, margin: 'normal',required: true, InputLabelProps: {
                      sx: { top: -6 }
                    }}
                  }}
                  
                />

                <TimePicker
                  label='Activity Time '
                  value={
                    formData.time
                      ? dayjs(
                          `1970-01-01 ${formData.time}`,
                          'YYYY-MM-DD h:mm A'
                        )
                      : null
                  }
                  onChange={newTime => {
                    if (newTime) {
                      setFormData(prev => ({
                        ...prev,
                        time: newTime.format('h:mm A')
                      }));
                    }
                  }}
                  ampm
                  slotProps={{
                    actionBar: {
                      sx: {
                        '& .MuiButton-textPrimary': {
                          color: 'black',
                        }
                      }
                    },
                    textField: { fullWidth: true, margin: 'normal', required:true, InputLabelProps: {
                      sx: { top: -6 }
                    } }
                  }}
                  
                />

                <TextField
                  label='Location '
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  margin='normal'
                  required
                  InputLabelProps={{
                    sx: {
                      top: -6,
                    }
                  }}
        
                />
                <TextField
                  label='Image URL (optional)'
                  name='image'
                  value={formData.image}
                  onChange={handleChange}
                  fullWidth
                  margin='normal'
                  InputLabelProps={{
                    sx: {
                      top: -6,
                    }
                  }}
        
                />
                <TextField
                  label='Phone (optional)'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  margin='normal'
                  InputLabelProps={{
                    sx: {
                      top: -6,
                    }
                  }}
        
                />
                <TextField
                  label='Address (optional)'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  margin='normal'
                  InputLabelProps={{
                    sx: {
                      top: -6,
                    }
                  }}
        
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
        {/* {message && (
          <Snackbar open autoHideDuration={3000}>
            <Alert severity='success'>{message}</Alert>
          </Snackbar>
        )} */}

        <Box textAlign='center' mb={2}>
          <Typography variant='h5' gutterBottom>
            Activities List
          </Typography>
          <Box display='flex' flexWrap='wrap' gap={2}>
            {sortedActivities.map(activity => (
              <Box
                key={activity.id}
                sx={{
                  width: 300,
                  minHeight: 300,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Card
                  sx={{
                    backgroundColor: '#A684FF',
                    padding: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    position: 'relative'
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

                  <IconButton
                    onClick={() => handleUpdateClick(activity)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'black'
                    }}
                  >
                    <PiPencilLine />
                    {/* <EditIcon /> */}
                  </IconButton>

                  {user.id === itineraryCreatorId && (
                    <IconButton
                      onClick={() => handleOpenDeleteDialog(activity)}
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        color: 'black'
                      }}
                    >
                      <PiTrash />

                      {/* <DeleteIcon /> */}
                    </IconButton>
                  )}
                </Card>
              </Box>
            ))}
          </Box>

        
          <Box mt={4} display='flex' justifyContent='center'>
          <Tooltip title="Add New Activity" arrow>

            <Fab
              color='primary'
              aria-label='add'
              onClick={handleOpen}
              sx={{
                backgroundColor: '#A684FF',
                '&:hover': { backgroundColor: '#8257E5' }
              }}
            >
<PiPlusBold />

            </Fab>
            </Tooltip>
          </Box>
        </Box>
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete{' '}
              <strong>{activityToDelete?.name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} sx={{ color: 'black' }}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete} //color="error"
              sx={{ color: 'black' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default Activity;
