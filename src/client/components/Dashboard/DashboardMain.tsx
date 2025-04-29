import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { createTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import CreateParty from './CreateParty';
// import BudgetPieChart from './BudgetPieChart'
import { user, userParty } from '../../../../types/models.ts';
import ImageUpload from '../ImageUpload';
interface DashboardProps {
  user: user;
}
interface party {
  id: number;
  name: string;
}
const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [partyInfo, setPartyInfo] = useState<{ id: number, name: string }[]>([])
  const userId = user.id

  useEffect(() => {
    getUserParties();
  }, [userId])

  const getUserParties = async () => {
    // console.log(userId)
    try {
      let response = await axios.get<userParty[]>(`api/party/userParty/${userId}`);
      const parties = response.data; // userParty array
      const partyIds = parties.map((party) => {
        return party.partyId
      })
      getPartyNames(partyIds);
    } catch (error) {
      console.error('Failed to find parties for this user');
    };
  };

  const getPartyNames = async (partyIds: number[]) => {
    try {
      const requests = partyIds.map(id =>
        axios.get<party>(`/api/party/${id}`)
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
        gap: 6 // spacing between the boxes
      }}
    >
      {/* Travel Parties Box */}
      <Box
        align="center"
        sx={{
          border: '4px solid black',
          borderRadius: 4,
          padding: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography variant='h4'>Your Travel Parties</Typography>
        <Divider  sx={{ mt:2, mb:2, width: '100%', align:'center', borderRadius: 6, border: '3px solid #a684ff'}}/>
        {partyInfo.map((selectedParty) => (
          <Box key={selectedParty.id} mb={1} sx={{padding: 4}}>
            <Link to={`/${selectedParty.id}?name=${encodeURIComponent(selectedParty.name)}`}>
              <Typography variant='h4' color='black'>
                {selectedParty.name}
              </Typography>
            </Link>
          </Box>
        ))}
        <CreateParty user={user} onPartyCreated={getUserParties} />
      </Box>

      {/* Image Upload Box */}
      <Box
      // sx={{
      //   border: '4px solid black',
      //   borderRadius: 4,
      //   padding: 4,
      //   maxWidth: 400,
      //   width: '100%',
      //   textAlign: 'center',
      // }}
      >
        <ImageUpload userId={user.id} />
      </Box>
    </Box>
  )
};

export default Dashboard;