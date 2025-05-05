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

const ALL_INTERESTS = ['Music/Dancing',
  'Bars',
  'Shows',
  'Sports',
  'Games',
  'Gambling',
  'Adult',
  'Food',
  'History',
  'Animals/Wildlife',
  'Museums',
  'Parks',
  'Major Events',
  'Fashion',
  'Outdoor Activities',
  'Self-care'];

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
    <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4 } }}>
      <Stack spacing={4} alignItems="center">

        {/* Username */}
        <Box sx={{ width: '100%' }}>
          {isEditingUsername ? (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <TextField
                variant="outlined"
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
                size="small"
                sx={{ width: { xs: 200, sm: 250 } }}
                InputProps={{
                  sx: {
                    fontSize: 'h2',
                    textAlign: 'center',
                  },
                }}
              />
              <Stack direction="row" spacing={1}>
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
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setEditedUsername(contextUser.username);
                    setIsEditingUsername(false);
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="h1"
                sx={{
                  textTransform: 'none',
                  textAlign: 'center',
                }}
              >
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
        </Box>

        {/* Avatar with Edit Button */}
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

        {/* Email */}
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          {contextUser.email}
        </Typography>

        {/* Interest Box */}
        <Box
          sx={{
            border: '4px solid black',
            borderRadius: 4,
            p: { xs: 2, sm: 4 },
            width: '100%',
            maxWidth: 350,
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3">
            Interest:
          </Typography>
          <Typography variant="body1" mb={2}>
            {currentInterest || 'None'}
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <FormLabel
              component="legend"
              sx={{
                color: 'black',
                '&.Mui-focused': {
                  color: 'primary.main',
                },
              }}
            >
              Change Interest
            </FormLabel>
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
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpdateInterest}>
              Update
            </Button>
          </FormControl>
        </Box>
      </Stack>
    </Container>
  )
}

export default Profile;