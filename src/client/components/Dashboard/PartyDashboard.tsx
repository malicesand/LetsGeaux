import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PiPencilBold, 
  PiTrashDuotone, 
  PiSidebarBold,
  PiSidebarThin  } from "react-icons/pi";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { 
  Box, 
  Typography, 
  Card,
  CardContent,
  useTheme, 
  useMediaQuery, 
  Dialog, 
  DialogTitle, 
  DialogContent } from '@mui/material';
import MessageBoard from './MessageBoard';
import BudgetPieChart from '../BudgetBuddy/BudgetPieChart';
import AddMember from './AddMember';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddItinerary from './AddItinerary';
import ResponsiveToolTip from './../ResponsiveToolTip.tsx';
import Itinerary from './DashItin.tsx';
import { user, email, party } from '../../../../types/models.ts';
import ImageUpload from '../ImageUpload';
interface PartyDashboardProps {
  user: user;
}

type PartyMember = {
  username: user['username'];
  avatar: user['profilePic'];
  id: user['id'];
};

// TODO conditional on render so that only party members can access a dashboard
const PartyDashboard: React.FC<PartyDashboardProps> = ({ user }) => {
  const theme = useTheme();
  const location = useLocation();
  const { partyId } = useParams();
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search);
  const numericPartyId = parseInt(partyId || '', 10);
  const partyName = searchParams.get('name')
  const userId = user.id;
  //* Members and Emails Constants *//
  const [partyMembers, setPartyMembers] = useState<PartyMember[]>([]);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [emails, setEmails] = React.useState<string[]>([]);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [emailLog, setEmailLog] = useState<string[]>([]);
  const [viewCode, setViewCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  //* Manage Party Constants *//
  const [newName, setNewName] = useState<party['name']>('');
  const [membersToRemove, setMembersToRemove] = useState<user['id'][]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [leaveParty, setLeaveParty] = useState(false);
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  //* Mobile Handling *//
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showMobileHelp, setShowMobileHelp] = useState(false);

  useEffect(() => {
    fetchViewCode(numericPartyId);
    getUsersForParty(numericPartyId);
    getEmailLog(partyId);
    // fetchItinerary(partyId)
  }, [numericPartyId]);

  // Key Down for Enter & Esc //
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLFormElement>,
    confirmAction: () => void,
    cancelAction: () => void
  ) => {
    console.log('pressed', e.key)
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmAction();
    }
    console.log('pressed', e.key)
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelAction();
    }
  };
  

  // GET REQUESTS //
  //* Member List *//
  const getUsersForParty = async (partyId: number) => {
    try {
      const response = await axios.get(`/api/party/usersInParty/${partyId}`);
      const users = response.data;
      const userObjects = users.map((user: user) => ({
        username: user.username,
        avatar: user.profilePic,
        id: user.id
      }))
      setPartyMembers(userObjects);
    } catch (error) {
      console.error('failed to find members for one or all parties');
    }
  };

  //* Fetch Itinerary *//
  const fetchItinerary = async (partyId: string) => {
    console.log(`Fetching itinerary`);
    try {
      const response = await axios.get(`/api/itinerary/party/${partyId}`);
    } catch (error) {
      console.error(`Error occurred fetching party itinerary for party ${partyId}`)
    }
  };

  //* Get Itinerary View Code *//
  const fetchViewCode = async (numericPartyId: number) => {
    try {
      const response = await axios.get(`/api/itinerary/party/${numericPartyId}`);
      if (response.data?.viewCode) {
        setViewCode(response.data.viewCode);
      }
      console.log(`view code at fetch ${response.data.viewCode}`)
    } catch (err) {
      console.error('Failed to fetch viewCode:', err);
    }
  };

  //* EMAIL *//
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
      // console.log(`Fetched ${addresses.length} emails for party${partyId}`);
    } catch (error) {
      console.error(`Failure: emailLog request for party ${partyId}`, error);
    }
  };

  //* Send E-Vite *//
  const sendEmail = async (
    emailList: string[],
    partyName: string,
    userId: number,
    partyId: string,
    viewCode: string,
  ) => {
    // console.log(`${partyName} @ send email party dash`)
    console.log(`view code at evite ${viewCode}`)
    try {
      await axios.post('/api/party/sendInvite', {
        emails: emailList,
        partyName: partyName,
        userId: userId,
        partyId: partyId,
        viewCode: viewCode
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

  // MANAGE PARTY //
  const renameModal = () => {
    setRenameOpen(true);
  }
  const closeRename = () => {
    setRenameOpen(false);
  }

  //* Toggle member removal *//
  const toggleMember = (id: number) => {
    setMembersToRemove(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  //* Party Management Confirmation *//
  const handleConfirmActions = async () => {
    setLoading(true);
    setRenameOpen(false);
    setConfirmOpen(false);
    try {
      if (newName) { await renameParty(numericPartyId, newName) };
      if (membersToRemove.length) {
        await Promise.all(
          membersToRemove.map((member) => deleteMembers(member, numericPartyId))
        );
      }
      if (leaveParty) { await deleteMembers(userId, numericPartyId) };
    } catch (error) {
      console.error('Error during party management actions:', error);
    } finally {
      setLoading(false);
    }
  };

  //*  Rename Party *//
  const renameParty = async (partyId: number, newName: string) => {
    try {
      await axios.patch(`/api/party/${partyId}`, { name: newName });
    } catch (error) {
      console.error(`Failure: rename party${partyId} to ${newName} `)
    }
  };

  //* Delete Members From A Party *//
  const deleteMembers = async (memberId: number, partyId: number) => {
    console.log(`Deleting user${memberId} from party ${partyId}`);
    try {
      await axios.delete(`/api/party/${memberId}/${partyId}`);
      console.log(`user: ${memberId} removed from party: ${partyId}`);
      if (memberId === userId) {
        navigate('/')
      } else {
        getUsersForParty(partyId);
      }
    } catch (error) {
      console.error(
        `Failed to remove user ${memberId} from party ${partyId}:`,
        error
      );
    }
  };

  //* Delete Party  *//
  const deleteParty = async (userId: number, partyId: string) => {
    console.log(`Deleting Party ${partyId}`);
    try {

    } catch (error) {
      console.error(`Error deleting party`, error)
    }
  };


  return (
    <React.Fragment>

<ImageUpload userId={user.id} />
      <Box sx={{ p:2 }}>
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <Typography variant='h1'sx={{ textAlign: 'center', mr: 2 }}
            >
            {partyName}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            position: 'relative', 
            top: 0,
            left: 0,
            zIndex: 10,
            
            // borderRadius: 3,
            p: 1,
            // boxShadow: 3,
          }}
        >
          <ResponsiveToolTip title="Manage Party">
            <IconButton size="small" onClick={renameModal}>
              <PiPencilBold />
            </IconButton>
          </ResponsiveToolTip>

          <ResponsiveToolTip title="Send Invite">
            <IconButton size="small" onClick={openModal}>
              <PiPencilBold />
            </IconButton>
          </ResponsiveToolTip>

          <ResponsiveToolTip title="Photo Gallery">
            <IconButton size="small">
              <PiPencilBold />
            </IconButton>
          </ResponsiveToolTip>

          <ResponsiveToolTip title={sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}>
            <IconButton size="small" onClick={() => setSidebarOpen(prev => !prev)}>
              {sidebarOpen ? <PiSidebarBold /> : <PiSidebarThin />}
            </IconButton>
          </ResponsiveToolTip>
        </Box>
        {/* Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            overflowX: 'auto',
          }}
        >
          {/* Party Info Sidebar */}
          {sidebarOpen && (
            <Card
              sx={{
                minWidth: 300,
                maxWidth: 350,
                flexShrink: 0,
                p: 2,
                border: '4px solid black',
                borderRadius: 4,      
                backgroundColor: '#C2A4F8',
                alignSelf: 'flex-start'
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    border: '4px solid black',
                    borderRadius: 4,
                    p: 2,
                    mb: 2,
                  }}
                >
                  <Typography variant='h5' textAlign='center'>
                    Party Members
                  </Typography>
                  <Box component='ul' sx={{ listStyle: 'none', pl: 0 }}>
                    {partyMembers.map(member => (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar src={member.avatar}/>
                        </ListItemAvatar>
                      <Typography variant='body1' component='li' key={member.id}>
                        {member.username}
                      </Typography>
                      </ListItem>
                    ))}
                  </Box>
                </Box>
                <AddMember
                  user={user}
                  partyId={numericPartyId}
                  partyName={partyName}
                  getMembers={getUsersForParty}
                />
                {/* Email Handling */}
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
                    }
                  }}
                >
                  <Box
                    component="form"
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      e.preventDefault();
                      if (emails.length > 0) {
                        setLoading(true);
                        sendEmail(emails, partyName, userId, partyId, viewCode)
                          .finally(() => setLoading(false));
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
                      type='submit'
                      disabled={emails.length === 0 || loading}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Invite'}
                    </Button>
                    {inviteSuccess && (
                      <Typography sx={{ mt: 1, color: 'green' }}>
                        Invite sent successfully!
                      </Typography>
                    )}
                  </Box>
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
                
                  </CardContent>
            </Card>       
          )} 
          
          {/* Itinerary */}
          <Box>
            <Itinerary
              user={user}
              partyId={numericPartyId}
              partyName={partyName}
            />
          </Box> 
      // </Box>
    // </Box>
      {/*  Manage Party Model */}
      <Dialog
        id='manageParty'
        open={renameOpen}
        onClose={closeRename}
        slotProps={{
          paper: {
            sx: { width: 500, borderRadius: 12 },
            component: 'form',
            onKeyDown: (e: React.KeyboardEvent<HTMLFormElement>) => handleKeyDown(e, () => setConfirmOpen(true), closeRename),
          }
        }}
      >
        <Typography variant='subtitle1' sx={{ mt: 2 }}>
          Change Party Name
        </Typography>
        <TextField
          id='partyName'
          type='text'
          fullWidth
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder='New Party Name'
        />
        <Typography variant='subtitle1' sx={{ mt: 2 }}>
          Remove Members
        </Typography>
        <Box component='ul' sx={{ listStyle: 'none', pl: 0 }}>
          {partyMembers
            .filter(member => member.id !== user.id)
            .map(member => (
              <ListItem
                key={member.id}
                secondaryAction={
                  <IconButton
                    edge='end'
                    aria-label='delete'
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMember(member.id)
                    }
                    }
                  >
                    <PiTrashDuotone
                      style={{
                        color: membersToRemove.includes(member.id) ? 'FF6B6B' : 'C4A1FF', // Color change based on selected state
                      }}
                    />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar src={member.avatar} />
                </ListItemAvatar>
                <ListItemText primary={member.username} />
              </ListItem>
            ))}
        </Box>
        <Typography variant='subtitle1' sx={{ mt: 2 }}>
          Leave Party
        </Typography>
        <FormControlLabel
          control={
            <Checkbox checked={leaveParty} onChange={e => setLeaveParty(e.target.checked)} />
          }
          label='Yes, I want to leave this party.'
        />
        <DialogActions>
          <Button variant='contained' onClick={closeRename}>Cancel</Button>
          <Button
            variant='contained'
            onClick={() => setConfirmOpen(true)}
          >
            Confirm Changes
          </Button>
        </DialogActions>
      </Dialog>
      {/* Manage Party Confirmation Modal */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleConfirmActions();
            },
            onKeyDown: (e: React.KeyboardEvent<HTMLFormElement>) => {
              e.preventDefault();
              e.stopPropagation();
              handleKeyDown(e, handleConfirmActions, () => setConfirmOpen(false));
            },
          },
        }}
      >
        <Typography>Are you sure?</Typography>
          <DialogContent>
            <Typography>You are about to:</Typography>
            <ul>
              {/* Message for Name Change */}
              {newName && (
              <Typography>
                Rename the party to: <strong>{newName}</strong>
                <Typography>(navigate to main dash for new name to render)</Typography>
              </Typography>)}
              {/* Message for Deleting others */}
              {membersToRemove.filter(id => id !== user.id).length > 0 && (
                <Typography>
                  Remove {membersToRemove.length} member(s)
                </Typography>)}
              {/* Message for Leaving */}
              {leaveParty && (
                <Typography>Leave the party</Typography>)}
            </ul>
          </DialogContent>
          <DialogActions>
            <Button 
              variant='contained' 
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              type='submit'
              onClick={handleConfirmActions}
              disabled={loading}
            >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Email Modal */}
      <Dialog
        open={open}
        onClose={closeModal}
        slotProps={{
          paper: {
            sx: { width: 500, borderRadius: 12 },  
          }
        }}
      >
        <Box
          component="form"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (emails.length > 0) {
              setLoading(true);
              sendEmail(emails, partyName, userId, partyId, viewCode)
              .finally(() => setLoading(false));
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
            type='submit'
            disabled={emails.length === 0 || loading} 
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Invite'}
          </Button>
          {inviteSuccess && (
            <Typography sx={{ mt: 1, color: 'green' }}>
              Invite sent successfully!
            </Typography>
          )}
        </Box>
      </Dialog>
    </React.Fragment>
          
  );
};
export default PartyDashboard;
