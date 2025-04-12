import React from 'react';
// import axios from 'axios';
import Suggestion from '../Suggestion.tsx';
import { Container, Typography, List, Card, Paper, Grid, Button, } from '@mui/material';

const Comment = () => {
  return (
    <Container>
        <Typography>I want to tell you something about what you said about your trip!</Typography>
        <Button>Like 🚀</Button>
    </Container>
  )
}

export default Comment;