import React, { useEffect } from 'react';
import axios from 'axios';
import Suggestion from '../Suggestion.tsx';
import { Container, Typography, List, Card, Paper, Grid, Button, } from '@mui/material';
import { user } from '../../../../types/models.ts';

interface CommentProps {
  user: user,
  getAllComments: Function
  currentComment: any
}


const Comment: React.FC<CommentProps> = ({user, getAllComments, currentComment}) => {
  const { body, postName, id } = currentComment;

const userId = user.id


  const deleteComment = () => {
    console.log(currentComment, user)
    axios.delete(`/api/comments/${id}/${userId}`).then(() => {
      getAllComments();
    }).catch((err) => console.error('unable to delete', err))
  }


  return (
    <Container>
        <Typography>{body}</Typography>
        <div>{id}</div>
        <Typography>By: {postName}</Typography>
        <Button>Like 🚀</Button>
        <Button onClick={deleteComment} >Delete 💣</Button>
    </Container>
  )
}

export default Comment;