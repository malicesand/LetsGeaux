import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText';
import MessageBoard from './MessageBoard';
import BudgetPieChart from '../BudgetBuddy/BudgetPieChart';
import AddMember from './AddMember';
import AddItinerary from './AddItinerary';
import Itinerary from '../Itinerary/Itinerary.tsx';
import { user, emails } from '../../../../types/models.ts';

interface PartyDashboardProps {
  user: user;
}

const PartyDashboard: React.FC<PartyDashboardProps>= ({ user }) => {
  const { partyId } = useParams();
  const numericPartyId = parseInt(partyId || '', 10);
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(undefined);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const partyName = searchParams.get('name');
  
  // const [partyInfo, setPartyInfo] = useState<{id: number, name: string}[]>([])
  const [partyMembers, setPartyMembers] = useState<string[]>([]);
  const userId = user.id 
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = useState<string>('')
  const [emails, setEmails] = React.useState<string[]>([])
  const [inviteSuccess, setInviteSuccess] = useState(false); 
  const [emailLog, setEmailLog] = useState<string[]>([]);

  
  useEffect(() => {
    getUsersForParty(numericPartyId);
    getEmailLog(partyId);
  },[numericPartyId])

  //* Read Member List *//
  const getUsersForParty = async (partyId: number) => { 
    try {
      const response = await axios.get(`/api/party/usersInParty/${partyId}`);
      const users = response.data;
      const usernames = users.map((user:user) => user.username)
      setPartyMembers(usernames);
    } catch (error) {
      console.error('failed to find members for one or all parties')
    }
  };
  //* Email Input Dialog
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  }; 
  
  //* Read Email Log *//
  const getEmailLog = async (numericPartyId: string) => {
    // console.log(`Sending email log request for Party:${partyId}`);
    try {
      const response = await axios.get(`/api/party/emails/${partyId}`);
      const emailData = response.data;
      const addresses = emailData.map((emails: emails) => emails.address);
      setEmails(addresses)
      console.log(`Fetched ${addresses.length} emails for party${partyId}`)
    } catch (error) {
      console.error(`Failure: emailLog request for party ${partyId}`, error)
    }
  }

  //* Send E-Vite *//
  const sendEmail = async(emailList: string[], partyName: string, userId: number, PartyId: string ) => { 
    // console.log(`${partyName} @ send email party dash`)
    try {
      await axios.post('/api/party/sendInvite', { emails: emailList, partyName: partyName, userId: userId, partyId: numericPartyId });
      setInviteSuccess(true);
      setInputValue('');
      setEmails([]);
      setTimeout(() => closeModal(), 3000)
      setTimeout(() => setInviteSuccess(false), 4000)
    } catch (error) { 
        console.error('could not send email', error)
    }
  }


  return (
    <Stack spacing={4} sx={{ p: 3 }}>
      <Typography variant="h4" align="center" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {partyName}
      </Typography>
      <Box display='flex' justifyContent='left'>
        <AddItinerary user={user} partyId={numericPartyId} partyName={partyName} />  
      </Box>
      <Box display = 'flex' justifyContent='left'>
        <Typography>
          Party Members
            <Box component = 'ul' 
              sx={{
                padding: "0 0",
                listStyle: 'none',
                display: 'grid',
                gap: '30px',
                // gridTemplateColumns: ''
              }}
            >
            </Box>
              {partyMembers.map((member) => {
                // console.log(`${member} in map`);
                return (
                  
                <Box key={member} component='li'>
                  {member}
                </Box>)}
              )}
        </Typography>
      </Box>
      <Box display='flex' justifyContent='left'>
        <AddMember user={user} partyId={numericPartyId} partyName={partyName} getMembers={getUsersForParty}/> 
      </Box>
      {<Button size='small' variant='contained' onClick={openModal}>
        Send an E-Vite
      </Button>}
        <Dialog
          open={open}
          onClose={closeModal}
          slotProps={{
            paper: {
              sx: { width: 500 },
              component: 'form',
            }
          }}
        >
          <Typography variant='subtitle1' sx={{ mt: 2 }}>
            Invite your friends to join your travel party
          </Typography>
          <TextField
            id='email'
            placeholder='Enter email to invite (separate multiples with commas!)'
            type='text'
            fullWidth
            value={inputValue}
            onChange={(event) => {
              const raw = event.target.value;
              setInputValue(raw);
              const parsedEmails = raw.split(',').map(email => email.trim()).filter(email => email.length > 0);
              setEmails(parsedEmails)
            }} 
          />
            <Button 
              sx={{ mt: 1 }}
              variant='outlined'
              onClick={() => sendEmail(emails, partyName, userId, numericPartyId)} disabled={emails.length === 0}
              >
              Invite
            </Button>
            {inviteSuccess && (
              <Typography sx={{ mt: 1, color: 'green' }}>
                Invite sent successfully!
              </Typography>
            )}
        </Dialog>
      {/* Message Board */}
      {/* <Box display="flex" justifyContent="center" alignItems="center">
        <Box sx={{ width: '60%' }}>
          <MessageBoard user={user} />
        </Box>
      </Box> */}
      <Box display="flex" justifyContent="center">
        {/* <Itinerary user={user}/> */}
      </Box>
    </Stack>
  )
};

export default PartyDashboard;