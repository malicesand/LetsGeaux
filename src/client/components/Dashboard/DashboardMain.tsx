import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import CreateGroup from './CreateGroup';
// import BudgetPieChart from './BudgetPieChart'
import { user, userParty } from '../../../../types/models.ts';

interface DashboardProps {
  user: user;
}
interface party {
  id: number;
  name: string;
}
const Dashboard: React.FC<DashboardProps>= ({ user }) => {
  const [partyInfo, setPartyInfo] = useState<{id: number, name: string}[]>([])
  const userId = user.id

  useEffect(() => {
    getUserParties();
  }, [userId])

  const getUserParties = async() => {
    // console.log(userId)
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
      // console.log(names);
      setPartyInfo(names);
    } catch (error) {
      console.error('Could not find names for one or all partyIds')
    };
  };


  return (
    <Box>
      <CreateGroup user={user} onPartyCreated={getUserParties}/>
        <Typography >
          Your Travel Parties
        </Typography>
        <Box>
          {partyInfo.map((selectedParty) => (
            <Box key={selectedParty.id} mb={1}>
              <Link to={`/${selectedParty.id}?name=${encodeURIComponent(selectedParty.name)}`}>
              <Typography variant='body1' color='primary'>
                {selectedParty.name}
              </Typography>
              </Link>
            </Box>
          ))}
        </Box>
      <Box position= 'absolute' bottom = '10%'>
        {/* <BudgetPieChart /> */}
      </Box>
    </Box>
  )
};

export default Dashboard;