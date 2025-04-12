import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import MessageBoard from './MessageBoard';
import CreateGroup from './CreateGroup';
import ReplyForm from './ReplyForm'
import BudgetPieChart from '../BudgetBuddy/BudgetPieChart';
import AddMember from './AddMember';

import { user, userParty, party } from '../../../../types/models.ts';

interface DashboardProps {
  user: user;
}
interface party {
  id: number;
  name: string;
}
const Dashboard: React.FC<DashboardProps>= ({ user }) => {
  // const [userWithParties, setUserWithParties] = useState<UserWithParties[]>
  const [partyNames, setPartyNames] = useState<string[]>([])
  const userId = user.id

  useEffect(() => {
    getUserParties();
  },[])

  const getUserParties = async() => {
    console.log(userId)
    try {
      let response = await axios.get<userParty[]>(`api/group/userParty/${userId}`);
      const parties = response.data; // userParty array
      const partyIds = parties.map((party)=> {
        return party.partyId
      })
      getPartyNames(partyIds);
    } catch (error) {
      console.error('Failed to find parties for this user');
    };
  };

  const getPartyNames = async(partyIds: number[]) => {
    try {
      const requests = partyIds.map(id => 
        axios.get<party>(`/api/group/${id}`)
      );
      const responses = await Promise.all(requests);
      const names = responses.map(res => res.data.name);
      setPartyNames(names);
    } catch (error) {
      console.error('Could not find names for one or all partyIds')
    };
  };

  return (
    <Box>
      <CreateGroup user={user} />
      <Box>
        <MessageBoard user={user}/>
      </Box>
      <AddMember />
      <Box position= 'absolute' bottom = '10%'>
        {/* <BudgetPieChart /> */}
      </Box>
    </Box>
  )
};

export default Dashboard;