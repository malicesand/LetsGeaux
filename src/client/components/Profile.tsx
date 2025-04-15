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
import { useUser } from './UserContext';

const ALL_INTERESTS = ['Restaurants', 'Hotels', 'Geos', 'Attractions'];

const Profile: React.FC = () => {
  const location = useLocation();
  const { user } = location.state;
  const { localUser: contextUser, setLocalUser } = useUser();

  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState('');

  // Set context user on load (if not already set)
  useEffect(() => {
    if (!contextUser?.id) {
      setLocalUser(user);
    }
  }, [contextUser, user, setLocalUser]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const userId = contextUser?.id;
        if (!userId) return;

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
  }, [contextUser?.id]);

  const handleUpdateInterest = async () => {
    try {
      const response = await axios.put(`/api/interests/${contextUser.id}`, {
        newInterest: selectedInterest,
      });
      setInterests([response.data.interest]);
    } catch (error) {
      console.error('Error updating interest:', error);
    }
  };

  const handleUploadWidget = () => {
    // @ts-ignore
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
            await axios.patch(`/api/users/${contextUser.id}/profile-pic`, {
              profilePic: imageUrl,
            });
            setLocalUser((prev: any) => ({ ...prev, profilePic: imageUrl }));
          } catch (err) {
            console.error('Failed to update profile pic in DB:', err);
          }
        }
      }
    );
    widget.open();
  };

  const currentInterest = interests[0]?.name;
  const interestOptions = ALL_INTERESTS.filter((i) => i !== currentInterest);

  if (!contextUser) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Profile Page</Typography>
      <Stack spacing={2} alignItems="center">
        <Avatar src={contextUser.profilePic} alt="Profile Picture" sx={{ width: 150, height: 150 }} />
        <Button variant="outlined" onClick={handleUploadWidget}>Change Profile Picture</Button>
        <Typography variant="h6">{contextUser.username}</Typography>
        <Typography variant="body1">{contextUser.email}</Typography>
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
        <ImageUpload userId={contextUser.id} />
      </Box>
    </Container>
  );
};

export default Profile;