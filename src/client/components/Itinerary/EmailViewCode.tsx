import React, { useState } from 'react';
import {
  Button,
  Box,
  Container,
  Typography,
  TextField,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EmailCode = () => {
  const [viewCode, setViewCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //when form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    //stops page rom refreshing
    e.preventDefault();
    if (!viewCode) {
      setError('Please Enter Code');
      //stops function
      return;
    }
    navigate(`/view/${viewCode}`);
  };

  return (
    <Container>
      <Box mt={6} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant='h5' gutterBottom align='center'>
          {' '}
          View Itinerary
        </Typography>
        <Typography variant='body1' align='center' mb={2}>
          Enter your itinerary code below to view your trip details.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label='Itinerary View Code'
            value={viewCode}
            onChange={e => setViewCode(e.target.value)}
            fullWidth
            margin='normal'
            autoFocus
          />
          {error && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box mt={3} display='flex' justifyContent='center'>
            <Button type='submit' variant='contained' color='primary'>
              View Itinerary
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default EmailCode;
