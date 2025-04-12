import React from 'react';
// import axios from 'axios';
import Suggestion from '../Suggestion.tsx';
import { Container, Typography, List, Card, Paper, Grid} from '@mui/material';
import Posts from './Posts.tsx';
import Comments from '.Comments.tsx';

const CommunityPage = () => {
  return (
    <Container>
      <Typography variant='h1'>Welcome to da pawty!</Typography>
      <Grid>
        <Comments />
      </Grid>
    </Container>
  )
}

export default CommunityPage;