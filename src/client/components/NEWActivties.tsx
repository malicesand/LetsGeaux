import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

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
}

interface Props {
  itineraryId: string; // Pass this as a prop to fetch activities for a specific itinerary
}

const Activity: React.FC<Props> = ({ itineraryId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState<Activity>({
    id: '',
    name: '',
    description: '',
    time: '',
    date: '',
    location: '',
    image: '',
    phone: '',
    address: '',
    itineraryId: itineraryId,
  });

  // Fetch activities for a specific itinerary when component mounts
  useEffect(() => {
    const getActivities = async () => {
      try {
        const response = await axios.get(`/api/activity/${itineraryId}`);
        setActivities(response.data);
      } catch (err) {
        console.error('Error fetching activities:', err);
      }
    };

    getActivities();
  }, [itineraryId]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<{ name?: string; value: any }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // POST a new activity
  const postActivity = async () => {
    try {
      const response = await axios.post('/api/activity', formData);
      setActivities([...activities, response.data]); // Add new activity to the list
      resetForm();
    } catch (err) {
      console.error('Error creating activity:', err);
    }
  };

  // PATCH (update an activity)
  const updateActivity = async () => {
    try {
      const updatedActivity = { ...formData };
      const response = await axios.patch(`/api/activity/${formData.id}`, updatedActivity);
      setActivities(activities.map((activity) =>
        activity.id === formData.id ? response.data : activity
      ));
      resetForm();
    } catch (err) {
      console.error('Error updating activity:', err);
    }
  };

  // DELETE an activity
  const deleteActivity = async (id: string) => {
    try {
      await axios.delete(`/api/activity/${id}`);
      setActivities(activities.filter((activity) => activity.id !== id));
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  // Reset the form after adding/updating an activity
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
      itineraryId: itineraryId, 
    });
  };

  // Handle update button click (pre-fill form for updating)
  const handleUpdateClick = (activity: Activity) => {
    setFormData(activity);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      updateActivity(); 
    } else {
      postActivity();
    }
  };

  return (
    <Container>
      {/* Form for creating/updating an activity */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {formData.id ? 'Update Activity' : 'Create Activity'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Activity Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            {formData.id ? 'Update Activity' : 'Add Activity'}
          </Button>
        </form>
      </Box>

      {/* Display list of activities */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Activities List
        </Typography>
        {activities.map((activity) => (
          <Box key={activity.id} mb={2}>
            <Typography variant="h6">{activity.name}</Typography>
            <Typography>{activity.description}</Typography>
            <Typography>{activity.time}</Typography>
            <Typography>{activity.date}</Typography>
            <Typography>{activity.location}</Typography>
            <Typography>{activity.phone}</Typography>
            <Typography>{activity.address}</Typography>
            <Button onClick={() => handleUpdateClick(activity)} variant="outlined">
              Update
            </Button>
            <Button
              onClick={() => deleteActivity(activity.id)}
              variant="outlined"
              color="secondary"
            >
              Delete
            </Button>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Activity;
