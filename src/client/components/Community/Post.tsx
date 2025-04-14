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
  const { body, id, postName } = currentPost
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
// const postId = currentPost.id;
const userId = user.id;
const deletePost = () => {
  axios.delete(`/api/posts/${id}/${userId}`).then(() => {
    getAllPosts();
  }).catch((err) => console.error('unable to delete post', err))
}

  return (
    <Container>
      <Card sx={{boxShadow: 10 }}>
        <Button onClick={deletePost}>Delete this post 💣</Button>
      <Typography> {body}</Typography>
      <Typography>By: {postName}</Typography>
      <Button>Like 🚀</Button>
      <Button onClick={startComments}>see comments</Button>
      {isCommenting ? (
        <Paper>
          <CommentForm postId={id} user={user} getAllComments={getAllComments} />
          <Comments
          user={user}
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