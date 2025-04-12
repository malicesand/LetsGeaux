import React from 'react';
// import axios from 'axios';
import Suggestion from '../Suggestion.tsx';
import { Container, Typography, List, Card, Paper, Grid} from '@mui/material';
import Post from './Post.tsx';
import PostForm from './PostForm.tsx';

const Posts = () => {
  return (
    <Container>
      <PostForm/>
      <Post/>
      <Post/>
      <Post/>
    </Container>
  )
}

export default Posts;