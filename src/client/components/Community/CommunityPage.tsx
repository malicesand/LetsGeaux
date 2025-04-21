import React, { useState, useEffect }from 'react';
import axios from 'axios';
import { Container, Typography, List, Card, Paper, Grid} from '@mui/material';
import Posts from './Posts.tsx';
import { user } from '../../../../types/models.ts';

interface CommunityFormProps {
  user: user;
}
const CommunityPage: React.FC<CommunityFormProps> = ({user}) => {
  const [postSet, setPostSet] = useState([])


  const getAllPosts = () => {
    axios.get('api/posts').then(({data}) => {
      setPostSet(data);
    }).catch((err) => console.error('unable to gather posts', err))
  }

useEffect(() => {
  getAllPosts();
}, [])


  return (
    <Container>
      <Typography variant='h1'>Welcome to the neighborhood!</Typography>
      <Grid>
        <Posts postSet={postSet} user={user} getAllPosts={getAllPosts} />
        {/* Actually, I don't think the comments will be rendered directly from here.. */}
        {/* <Comments /> */}
      </Grid>
    </Container>
  )
}

export default CommunityPage;