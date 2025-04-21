import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import MessageBoard from './MessageBoard';
import BudgetPieChart from '../BudgetBuddy/BudgetPieChart';
import AddMember from './AddMember';
import AddItinerary from './AddItinerary';
import Itinerary from './PartyItinerary.tsx';
import { user, email } from '../../../../types/models.ts';

interface PartyDashboardProps {
  user: user;
}
// TODO conditional to on render so that only party members can access a dashboard
const PartyDashboard: React.FC<PartyDashboardProps> = ({ user }) => {
  const theme = useTheme();
  const { partyId } = useParams();
  const numericPartyId = parseInt(partyId || '', 10);
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(undefined);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const partyName = searchParams.get('name'); 
  // const [partyInfo, setPartyInfo] = useState<{id: number, name: string}[]>([])
  const [partyMembers, setPartyMembers] = useState<string[]>([]);
  const userId = user.id;
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [emails, setEmails] = React.useState<string[]>([]);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [emailLog, setEmailLog] = useState<string[]>([]);

  useEffect(() => {
    getUsersForParty(numericPartyId);
    getEmailLog(partyId);
  }, [numericPartyId]);

  //* Read Member List *//
  const getUsersForParty = async (partyId: number) => {
    try {
      const response = await axios.get(`/api/party/usersInParty/${partyId}`);
      const users = response.data;
      const usernames = users.map((user: user) => user.username);
      setPartyMembers(usernames);
    } catch (error) {
      console.error('failed to find members for one or all parties');
    }
  };
  // * Delete Members From A Party * //
  const deleteMembers = async (userId: number, partyId: string) => {
    console.log(`Deleting user${userId} from party ${partyId}  `);
    try {
      const response = await axios.get(`/api/party/:userId/:partyId`);
      console.log(`user: ${userId} removed from party: ${partyId}`);
    } catch (error) {
      console.error(
        `Failed to remove user ${userId} from party ${partyId}:`,
        error
      );
    }
  };
  //* Email Input Dialog
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };
  //* Fetch Invites *//
  const getEmailLog = async (partyId: string) => {
    //  log(`Sending email log request for Party:${partyId}`);
    try {
      const response = await axios.get(`/api/party/emails/${partyId}`);
      const emailData = response.data;
      const addresses = emailData.map((email: email) => email.address);
      setEmailLog(addresses);
      console.log(`Fetched ${addresses.length} emails for party${partyId}`);
    } catch (error) {
      console.error(`Failure: emailLog request for party ${partyId}`, error);
    }
  };
  //* Send E-Vite *//
  const sendEmail = async (
    emailList: string[],
    partyName: string,
    userId: number,
    partyId: string
    // ! viewCode: string,
  ) => {
    // console.log(`${partyName} @ send email party dash`)
    try {
      await axios.post('/api/party/sendInvite', {
        emails: emailList,
        partyName: partyName,
        userId: userId,
        partyId: partyId
        // TODO viewCode: viewCode
      });
      setInviteSuccess(true);
      setInputValue('');
      setEmails([]);
      getEmailLog(partyId);
      setTimeout(() => closeModal(), 3000);
      setTimeout(() => setInviteSuccess(false), 4000);
    } catch (error) {
      console.error('could not send email', error);
    }
  };
  // * Rename Party *//
  const renameParty = async (partyId: string, newName: string) => {
    try {
      await axios.patch(`/api/party/${partyId}`, {name: newName});
    } catch (error) {
      console.error(`Failure: rename party${partyId} to ${newName} `)
    }
  }
  // * Delete Party * //
  const deleteParty = async (userId: number, partyId: string) => {
    
  }

  return (
    <React.Fragment>
      <Typography
        variant='h1'
        align='center'
        sx={{ flexGrow: 1, textAlign: 'center', m: 5, p: '4px' }}
      >
        {partyName}
      </Typography>
      <Box>
        <Stack spacing={4} direction="row">
          <Box
            sx={{
              width: '100%',
              maxWidth: '300px',
              margin: '0',
              border: '4px solid black',
              borderRadius: 4,
              padding: 3,
              mt: 7,
              pt: 4
            }}
          >
            <Stack spacing={4} sx={{ width: '100%' }}>
              <Box
                display='flex'
                flexDirection='column'
                alignItems='flex-start'
                gap={2}
              >
                <AddItinerary
                  user={user}
                  partyId={numericPartyId}
                  partyName={partyName}
                />
                <Container
                  sx={{
                    maxWidth: 500,
                    border: '4px solid black',
                    borderRadius: 4,
                    margin: '0 auto',
                    p: 2
                  }}
                >
                  <Typography variant='h5' textAlign='center'>
                    Party Members
                  </Typography>
                  <Box component='ul' sx={{ listStyle: 'none', pl: 0 }}>
                    {partyMembers.map(member => (
                      <Typography variant='body1' component='li' key={member}>
                        {member}
                      </Typography>
                    ))}
                  </Box>
                </Container>
                <AddMember
                  user={user}
                  partyId={numericPartyId}
                  partyName={partyName}
                  getMembers={getUsersForParty}
                />
                <Button
                  size='medium'
                  // color='secondary'
                  variant='contained'
                  onClick={openModal}
                  sx={{ width: 'auto', m: 'auto', p: 'auto' }}
                >
                  Send an E-Vite
                </Button>
                <Dialog
                  open={open}
                  onClose={closeModal}
                  slotProps={{
                    paper: {
                      sx: { width: 500, borderRadius: 12 },
                      component: 'form'
                    }
                  }}
                >
                  <Typography variant='subtitle1' sx={{ mt: 2 }}>
                    Invite your friends to join your travel party
                  </Typography>
                  <TextField
                    id='email'
                    placeholder='Enter Multiple Emails'
                    type='text'
                    fullWidth
                    value={inputValue}
                    onChange={event => {
                      const raw = event.target.value;
                      setInputValue(raw);
                      const parsedEmails = raw
                        .split(',')
                        .map(email => email.trim())
                        .filter(email => email.length > 0);
                      setEmails(parsedEmails);
                    }}
                  />
                  <Button
                    sx={{ mt: 1 }}
                    variant='contained'
                    onClick={() =>
                      sendEmail(emails, partyName, userId, partyId)
                    }
                    disabled={emails.length === 0}
                  >
                    Invite
                  </Button>
                  {inviteSuccess && (
                    <Typography sx={{ mt: 1, color: 'green' }}>
                      Invite sent successfully!
                    </Typography>
                  )}
                </Dialog>
                {emailLog.length > 0 && (
                  <Container
                    sx={{
                      maxWidth: 500,
                      border: '4px solid black',
                      borderRadius: 4,
                      margin: '0 auto',
                      p: 2
                    }}
                  >
                    <Typography variant='h5' gutterBottom>
                      Sent Invitations
                    </Typography>
                    <Box
                      component='ul'
                      sx={{ listStyle: 'none', padding: 0, m: 0 }}
                    >
                      {emailLog.map((mail, i) => (
                        <Typography
                          key={i}
                          variant='body1'
                          component='li'
                          sx={{ mb: 0.5 }}
                        >
                          {mail}
                        </Typography>
                      ))}
                    </Box>
                  </Container>
                )}
                {/* Message Board */}
                {/* <Box display="flex" justifyContent="center" alignItems="center">
                <Box sx={{ width: '60%' }}>
                  <MessageBoard user={user} />
                </Box>
              </Box> */}
                {/* <Box display="flex" justifyContent="center"> */}
                {/* <Itinerary user={user}/> */}
              </Box>
            </Stack>
          </Box>
          <Box>
            <Itinerary
              user={user}
              partyId={numericPartyId}
              partyName={partyName}
            />
          </Box>
        </Stack>
      </Box>
    </React.Fragment>
  );
};
export default PartyDashboard;
