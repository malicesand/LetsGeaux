import React, { useState, useEffect, useMemo } from 'react';
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
  Stack,
  TextField
} from '@mui/material';
import ImageUpload from './ImageUpload';
import { useUser } from './UserContext';
import { PiPencilBold } from "react-icons/pi";

const ALL_INTERESTS = ['Restaurants', 'Hotels', 'Geos', 'Attractions'];

const Profile: React.FC = () => {
  const location = useLocation();
  const { user } = location.state;
  const { localUser: contextUser, setLocalUser } = useUser();

  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState('');
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

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
  }, []);

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
  const handleUpdateUsername = async () => {
    try {
      await axios.patch('/api/users/update-username', {
        contextUserId: contextUser.id,
        username: editedUsername,
      });


      setLocalUser((prev: any) => ({ ...prev, username: editedUsername }));
    } catch (error) {
      console.error('Error updating username:', error);
    } finally {
      setIsSavingUsername(false);
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
  const interestOptions = useMemo(() => ALL_INTERESTS.filter((i) => i !== currentInterest), [currentInterest]);

  if (!contextUser) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {isEditingUsername ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            variant="outlined"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            size="small"
            sx={{ width: 200 }}
            InputProps={{
              sx: { fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={async () => {
              await handleUpdateUsername();
              setIsEditingUsername(false);
            }}
            disabled={isSavingUsername || editedUsername === contextUser.username}
          >
            {isSavingUsername ? 'Saving...' : 'Save'}
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h3" gutterBottom align="center">
            {contextUser.username}
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => setIsEditingUsername(true)}
            sx={{
              minWidth: 0,
              padding: 0,
              color: 'black',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <PiPencilBold size={20} />
          </Button>
        </Stack>
      )}

      <Stack spacing={2} alignItems="center">
        {/* Wrapper box to position the edit icon */}
        <Box sx={{ position: 'relative', width: 150, height: 150 }}>
          <Avatar
            src={contextUser.profilePic}
            alt="Profile Picture"
            sx={{
              width: 150,
              height: 150,
              border: '4px solid black',
              boxShadow: 1,
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: 6,
                bgcolor: '#fffff',
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleUploadWidget}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              minWidth: 0,
              width: 40,
              height: 40,
              borderRadius: '50%',
              p: 0,
              color: 'primary',
            }}
          >
            <PiPencilBold />
          </Button>
        </Box>

        <Typography variant="body1">{contextUser.email}</Typography>
      </Stack>

      <Box mt={4}
        sx={{
          border: '4px solid black',
          borderRadius: 4,
          padding: 4,
          maxWidth: 300,
          textAlign: 'center',
          mx: 'auto',
        }}
      >
        <Typography variant="h5" textTransform="uppercase" fontWeight='700' > Interest:</Typography>
        <Typography variant="body1">{currentInterest || 'None'}</Typography>

        <Box mt={3}>
          <FormControl component="fieldset" >
            <FormLabel component="legend" sx={{
              color: 'black',
              '&.Mui-focused': {
                color: '#3200FA',

              },
            }}>Change Interest</FormLabel>
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

              sx={{ mt: 2 }}
              onClick={handleUpdateInterest}
            >
              Update
            </Button>
          </FormControl>
        </Box>

      </Box>
      <Box mt={4}>

      </Box>
    </Container>
  );
};

export default Profile;