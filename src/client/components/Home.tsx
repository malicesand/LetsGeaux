import React from 'react';
import { user } from '../../../types/models.ts';
import Dashboard from './Dashboard/DashboardMain';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import { useUser } from './UserContext'
interface HomeProps {
  user: user;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const { localUser: contextUser } = useUser();
  const displayUsername = contextUser?.username || user?.username

  return (
    <div>
      <Typography variant='h3' align="center" color='black'>
        Hello, {displayUsername}!!!
      </Typography>
      <Box height={32} />
      <Dashboard user={user} />
    </div>
  );
};

export default Home;