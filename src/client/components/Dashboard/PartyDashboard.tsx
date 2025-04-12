import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import MessageBoard from './MessageBoard';
import CreateGroup from './CreateGroup';
import ReplyForm from './ReplyForm'
import BudgetPieChart from '../BudgetBuddy/BudgetPieChart';
import AddMember from './AddMember';
import { useParty } from './PartyContext';
import { user } from '../../../../types/models.ts';

interface PartyDashboardProps {
  user: user;

}

const PartyDashboard: React.FC<PartyDashboardProps>= ({ user }) => {
  const { partyId, partyName } = useParty()
  // const [userWithParties, setUserWithParties] = useState<UserWithParties[]>
  const [partyInfo, setPartyInfo] = useState<{id: number, name: string}[]>([])
  const [currentPartyId, setCurrentPartyId] = useState<number | null>(null);
  const [partyMembers, setPartyMembers] = useState<string[]>([]);
  const userId = user.id

  useEffect(() => {
    getUsersForParty(partyId);
  },[])

  

  

  const getUsersForParty = async (partyId: number) => {
    try {
      const response = await axios.get(`/api/group/usersInParty/${partyId}`);
      const users = response.data;
      const usernames = users.map((user:user) => user.username)
      console.log(usernames);
      setPartyMembers(usernames);
    } catch (error) {
      console.error('failed to find members for one or all parties')
    }
  };

  return (
    <Box>
      
      
      <Box>
        <MessageBoard user={user}/>
      </Box>
      <AddMember />
      <Box position= 'absolute' bottom = '10%'>
        <BudgetPieChart />
      </Box>
    </Box>
  )
};

export default PartyDashboard;