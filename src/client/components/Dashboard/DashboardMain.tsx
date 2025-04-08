import React from 'react';
import BudgetPieChart from '../BudgetBuddy/BudgetPieChart';
import AddFriend from './AddFriend';

const Dashboard: React.FC = () => {
  return (
    <div>
      <AddFriend />
      <BudgetPieChart />
    </div>
  )
};

export default Dashboard;