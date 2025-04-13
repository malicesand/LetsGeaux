import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import CommentForm from './CommentForm.tsx';
import { user } from '../../../../types/models.ts';

interface PostProps {
  user: user,
  currentPost: any
  getAllPosts: Function

}

const Post: React.FC<PostProps> = ({user, currentPost, getAllPosts}) => {
  const { body, id } = currentPost
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentSet, setCommentSet] =useState([]);

const getAllComments = () => {
  axios.get(`/api/comments/${+id}`).then(({data}) => {
    setCommentSet(data)
  }).catch((err) => console.error('unable to gather comments', err));
}
useEffect(() => {
  getAllComments();
}, []);

const startComments = () => {
  setIsCommenting(true);
}
const endComments = () => {
  setIsCommenting(false);
}


  return (
    <Container>
      <Card sx={{boxShadow: 10 }}>
      <Typography> {body}</Typography>
      <Button>Like 🚀</Button>
      <Button onClick={startComments}>see comments</Button>
      {isCommenting ? (
        <Paper>
          <CommentForm postId={id} user={user} getAllComments={getAllComments} />
          <Comments
          postId={id}
          getAllComments={getAllComments}
          commentSet={commentSet}
          isCommenting={isCommenting}
          endComments={endComments}
          />
          <Button onClick={endComments}>Close window</Button>
        </Paper>
      )
      : (
        null
      )}
      </Card>
    </Container>
  )
}

export default Post;