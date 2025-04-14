import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Avatar,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Box,
  Stack
} from '@mui/material';
import ImageUpload from './ImageUpload';

const ALL_INTERESTS = ['Restaurants', 'Hotels', 'Geos', 'Attractions']; 

const Profile: React.FC = () => {
  const location = useLocation();
  const { user } = location.state;
  const [localUser, setLocalUser] = useState(user);
  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState('');

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const userId = localUser.id;
        const response = await axios.get(`/api/interests/${userId}`);
        setInterests(response.data);

        const current = response.data[0]?.name;
        const otherOptions = ALL_INTERESTS.filter((i) => i !== current);
        setSelectedInterest(otherOptions[0]);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchInterests();
  }, [localUser.id]);

  const handleUpdateInterest = async () => {
    try {
      const response = await axios.put(`/api/interests/${localUser.id}`, {
        newInterest: selectedInterest,
      });
      setInterests([response.data.interest]);
    } catch (error) {
      console.error('Error updating interest:', error);
    }
  };

  const currentInterest = interests[0]?.name;
  const interestOptions = ALL_INTERESTS.filter((i) => i !== currentInterest);

  useEffect(() => {
    if (!document.querySelector('script[src="https://widget.cloudinary.com/v2.0/global/all.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleUploadWidget = () => {
    // @ts-ignore - Cloudinary not typed
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dcrrsec0d',
        uploadPreset: 'LetsGeaux Profile',
        sources: ['local', 'url', 'camera', 'google_drive'],
        multiple: false,
        folder: 'letsGeaux',
        transformation: [{ width: 150, height: 150, crop: 'limit' }],
      },
      async (error: any, result: any) => {
        if (!error && result.event === 'success') {
          const imageUrl = result.info.secure_url;
          try {
            await axios.patch(`/api/users/${localUser.id}/profile-pic`, {
              profilePic: imageUrl,
            });
            setLocalUser((prevUser:any) => ({
              ...prevUser,
              profilePic: imageUrl,
            }));
          } catch (err) {
            console.error('Failed to update profile pic in DB:', err);
          }
        }
      }
    );
    widget.open();
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Profile Page</Typography>
      <Stack spacing={2} alignItems="center">
        <Avatar src={localUser.profilePic} alt="Profile Picture" sx={{ width: 150, height: 150 }} />
        <Button variant="outlined" onClick={handleUploadWidget}>Change Profile Picture</Button>
        <Typography variant="h6">{localUser.username}</Typography>
        <Typography variant="body1">{localUser.email}</Typography>
      </Stack>

      <Box mt={4}>
        <Typography variant="h6">Current Interest:</Typography>
        <Typography variant="body1">{currentInterest || 'None'}</Typography>
      </Box>

      <Box mt={3}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Change Interest</FormLabel>
          <RadioGroup
            value={selectedInterest}
            onChange={(e) => setSelectedInterest(e.target.value)}
          >
            {interestOptions.map((interest) => (
              <FormControlLabel
                key={interest}
                value={interest}
                control={<Radio />}
                label={interest}
              />
            ))}
          </RadioGroup>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleUpdateInterest}
          >
            Update Interest
          </Button>
        </FormControl>
      </Box>

      <Box mt={4}>
        <ImageUpload userId={localUser.id} />
      </Box>
    </Container>
  );
};

export default Profile;