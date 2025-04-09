import React from 'react';

import Box from '@mui/material/Box';


import positions from '@mui/system/positions';

import AddFriend from './AddFriend';
import CreateGroup from './CreateGroup';
import BudgetPieChart from '../BudgetBuddy/BudgetPieChart';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <AddFriend />
      <Box position= 'absolute' bottom = '10%'>

        <BudgetPieChart />
      </Box>
    </Box>
  )
};

export default Dashboard;