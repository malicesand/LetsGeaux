import React from 'react';
import { user } from '../../../types/models.ts';
import Dashboard from './Dashboard/DashboardMain';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
interface HomeProps {
  user: user;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  return (
    <div>
      <Typography variant='h1' color='black'>Hello, {user.username}!!!</Typography>
      <Box height={32} />
      <Dashboard user={user} />
    </div>
  )
}

export default Home;