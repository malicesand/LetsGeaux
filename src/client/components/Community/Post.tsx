import React from 'react';
// import axios from 'axios';
import Suggestion from '../Suggestion.tsx';
import {
  Container,
  Typography,
  List,
  Card,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import Comments from './Comments.tsx';

const Post = () => {
  return (
    <Container>
      <Card sx={{boxShadow: 10 }}>
      <Typography> I'm saying something about a trip I went on and I want people to talk about it!!!</Typography>
      <Button>Like 🚀</Button>
      <Comments />
      </Card>
    </Container>
  )
}

export default Post;