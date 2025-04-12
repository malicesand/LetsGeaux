import React from 'react';
// import axios from 'axios';
import Suggestion from '../Suggestion.tsx';
import { Container, Typography, List, Card, Paper, Grid} from '@mui/material';
import Comment from './Comment.tsx'
import CommentForm from './CommentForm.tsx';

const Comments = () => {
  return (
    <Container>
      <Card >
      <Comment />
      </Card>
      <Card >
      <Comment />
      </Card>
    </Container>


  )
}

export default Comments;