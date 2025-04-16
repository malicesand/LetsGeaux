import React from 'react';
import { user } from '../../../types/models.ts';
import Dashboard from './Dashboard/DashboardMain';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
interface HomeProps {
  user: user;
}

const Home: React.FC<HomeProps> = ({user}) => {
  return (
    <div>
    <Typography variant='h1' color='primary'>Hello, {user.username}!!!</Typography>
    <Dashboard user={user}/>
    </div>
  )
}

export default Home;