import React from 'react';
import axios from 'axios';
import ActivityForm from './ActivityForm';
import { Container, Card, Typography, Dialog, Grid, Avatar, } from '@mui/material'
import Suggestion from './Suggestion';

// const Grid = Grid2;
const Suggestions = () => {
  return (
    <Container>
      <Suggestion />
      <ActivityForm />
    </Container>
  )
}
export default Suggestions;
