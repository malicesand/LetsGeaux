import React, { useEffect, useState } from 'react';
import axios from 'axios';

// import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FilledInput from '@mui/material/FilledInput';
import Divider from '@mui/material/Divider';

import { useParty } from './PartyContext';

import { user } from '../../../../types/models.ts'
interface groupProps {
  user: user;
}

const CreateGroup: React.FC<groupProps> = ({user}) => {
  const userId = user.id;
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = useState<string>('')
  const [emails, setEmails] = React.useState<string[]>([])
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [partySuccess, setPartySuccess] = useState(false);
  const [member, setMember] = useState<user>()
  const { setPartyName, setPartyId, partyName } = useParty()
  

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  
  //* Request Handling *//
  const createParty = async (name:string, partyName:string) => {
    // console.log(`Creating...${name}`);
    
    setPartyName(partyName)
    // console.log(partyName, 'line41')
    try {
      let response = await axios.post('/api/group', {name} );
      // console.log(`${name} created!`)
      // console.log(`${response.data.id} partyId!`)
      const id = (response.data.id);
      setPartyId(id);
      setPartySuccess(true);
      setTimeout(() => setPartySuccess(false), 10000)
      addUserToParty(userId, id, partyName);
    } catch (error) {
      console.error('failed to create new group');
    };
  };
  //* Add Current User to Party *//
  const addUserToParty = async(userId:number, partyId:number, partyName: string) => {
    // console.log(`this is a partyId:${partyId}`);
    // console.log(`Travel Party ${partyName} Created`)
    try {
      let response = await axios.post('/api/group/userParty', {userId, partyId});
      // console.log(`userParty logged ${partyName}`);
    } catch (error) {
      console.error('Could not create new userParty model', error);
    }
  }; 
  //* Send E-Vite *//
  const sendEmail = async(emailList: string[], partyName:string) => {
    try {
      await axios.post('/api/group/sendInvite', { emails: emailList, partyName });
      console.log(`Invited ${emails} to ${partyName}`)
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
    <React.Fragment>
      <Button variant='contained' onClick={openModal}>
        Create a Travel Party!
      </Button>
      <Dialog
        open={open}
        onClose={closeModal}
        slotProps={{
          paper: {
            sx: { width: 500 },
            component: 'form',
            onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const partyName = (formJson.party);
              createParty(formJson.party, partyName);
            }
          }
        }}
      >
        <DialogTitle>Name Your Party</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a name for your travel party!
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin='dense'
            id='name'
            name='party'
            label='Party Name'
            type='string'
            fullWidth
            variant='standard'
          />
          <DialogActions>
            <Button type='submit'>Create</Button>
          </DialogActions>
          {partySuccess && (
            <Typography sx={{ mt: 1, color: 'green' }}>
              Party Created!
            </Typography>
          )}
          <Divider/>

          <Typography variant='subtitle1' sx={{ mt: 2 }}>
            Invite your friends to join your travel party
          </Typography>
          <FilledInput

            id='email'
            placeholder='Enter email to invite (separate multiples with commas!'
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
            onClick={() => sendEmail(emails, inputValue)} disabled={emails.length === 0}
            >
            Invite
          </Button>
          {inviteSuccess && (
            <Typography sx={{ mt: 1, color: 'green' }}>
              Invite sent successfully!
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            You can also invite friends later from your party dashboard.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
};

export default CreateGroup
