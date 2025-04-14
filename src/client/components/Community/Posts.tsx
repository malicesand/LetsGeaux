import React from 'react';
import axios from 'axios';
import Suggestion from '../Suggestion.tsx';
import { Container, Typography, List, Card, Paper, Grid} from '@mui/material';
import Post from './Post.tsx';
import PostForm from './PostForm.tsx';
import { user } from '../../../../types/models.ts';

interface PostProps {
  user: user;
  postSet: [],
  getAllPosts: Function,
}

const Posts: React.FC<PostProps> = ({user, postSet, getAllPosts}) => {
  return (
    <Container>
      <PostForm getAllPosts={getAllPosts} user={user}/>
        {postSet.map((currentPost) => (
          <Paper key={currentPost.id}>
            <Post currentPost={currentPost} user={user} getAllPosts={getAllPosts}/>
          </Paper>

        ))}

    </Container>
  )
}

export default Posts;