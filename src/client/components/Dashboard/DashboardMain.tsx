import React from 'react';

import Box from '@mui/material/Box';
import MessageBoard from './MessageBoard';
import CreateGroup from './CreateGroup';
import ReplyForm from './ReplyForm'
import BudgetPieChart from '../BudgetBuddy/BudgetPieChart';

import MessageList from './MessageList';

import AddMember from './AddMember';

import { user } from '../../../../types/models.ts';

interface DashboardProps {
  user: user;
}


const Dashboard: React.FC<DashboardProps>= ({ user }) => {
  return (
    <Box>
      <CreateGroup user={user}/>
      <Box>
        <MessageBoard user={user}/>
        
        
      </Box>
      <Box position= 'absolute' bottom = '10%'>
        {/* <BudgetPieChart /> */}
      </Box>
    </Box>
  )
};

export default Dashboard;