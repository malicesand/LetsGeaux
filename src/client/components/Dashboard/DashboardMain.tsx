import React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';



import AddMember from './AddMember';
import CreateGroup from './CreateGroup';
import BudgetPieChart from '../BudgetBuddy/BudgetPieChart';

import { user } from '../../../../types/models.ts';

interface DashboardProps {
  user: user;
}

const sendEmail = async() => {
  try {
    await axios.post('/api/group/sendInvite');
    console.log('success')
  } catch (error) {
      console.error('could not send email')

  }

}

const Dashboard: React.FC<DashboardProps>= ({ user }) => {
  return (
    <Box>
      <AddMember user={user}/>
      <CreateGroup user={user}/>
      <Box position= 'absolute' bottom = '10%'>
      <Button onClick={sendEmail}> hit this button </Button>
        <BudgetPieChart />
      </Box>
    </Box>
  )
};

export default Dashboard;