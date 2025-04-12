import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import MessageBoard from './MessageBoard';
import CreateGroup from './CreateGroup';
import ReplyForm from './ReplyForm'
import BudgetPieChart from '../BudgetBuddy/BudgetPieChart';
import AddMember from './AddMember';

import { user, userParty } from '../../../../types/models.ts';

interface DashboardProps {
  user: user;
}
interface party {
  id: number;
  name: string;
}
const Dashboard: React.FC<DashboardProps>= ({ user }) => {
  // const [userWithParties, setUserWithParties] = useState<UserWithParties[]>
  const [partyInfo, setPartyInfo] = useState<{id: number, name: string}[]>([])
  const [currentPartyId, setCurrentPartyId] = useState<number | null>(null);
  const [partyMembers, setPartyMembers] = useState<string[]>([]);
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
      const names = responses.map((res) => ({
        id: res.data.id,
        name: res.data.name
      }));
      console.log(names);
      setPartyInfo(names);
    } catch (error) {
      console.error('Could not find names for one or all partyIds')
    };
  };


  return (
    <Box>
      <CreateGroup user={user} />
      <Box>
        <Typography component='ul'>
          Your Travel Parties
          {partyInfo.map((party) => (
            <li key={party.id}>
              <Link to={`/party/${String(party.id)}`}>
              {party.name}
              </Link>
            </li>
          ))}
        </Typography>
      </Box>
      <Box position= 'absolute' bottom = '10%'>
        {/* <BudgetPieChart /> */}
      </Box>
    </Box>
  )
};

export default Dashboard;