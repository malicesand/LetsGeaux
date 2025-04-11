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

import { user } from '../../../../types/models.ts'
interface groupProps {
  user: user;
}

const CreateGroup: React.FC<groupProps> = ({user}) => {
  const [open, setOpen] = React.useState(false);
  const [partyName, setPartyName] = React.useState<string>('');
  // const [partyId, setPartyId] = useState<number>(); 
  const userId = user.id;
  const [email, setEmail] = React.useState<string>('')
  

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  
// * Request Handling * //
  const createParty = async (name:string, partyName:string) => {
    // console.log(`Creating...${name}`);
    setPartyName(partyName)
    console.log(partyName, 'line41')
    try {
      let response = await axios.post('/api/group', {name} );
      // console.log(`${name} created!`)
      // console.log(`${response.data.id} partyId!`)
      const partyId = (response.data.id);
      console.log(partyName, 'line47')
      addUserToParty(userId, partyId, partyName);
    } catch (error) {
      console.error('failed to create new group');
    };
  };
  const addUserToParty = async(userId:number, partyId:number, partyName: string) => {
    // console.log(`this is a partyId:${partyId}`);

    console.log(`Travel Party ${partyName} Created`)
    try {
      let response = await axios.post('/api/group/userParty', {userId, partyId});
      console.log(`userParty logged ${partyName}`);
    } catch (error) {
      console.error('Could not create new userParty model', error);
    }
  }; 

  const sendEmail = async(email: string, partyName:string) => {
    try {
      await axios.post('/api/group/sendInvite', { email, partyName });
      console.log(`Invited ${email} to ${partyName}`)
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
            component: 'form',
            onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              // closeModal();
              const partyName = (formJson.party);
              // setPartyName(formJson.party);
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

          <Divider/>

          <Typography variant='subtitle1' sx={{ mt: 2 }}>
            Invite your friends to join your travel party
          </Typography>
          <FilledInput

            id='email'
            placeholder='Enter email to invite'
            type='email'
            fullWidth
            value={email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              console.log(event.target.value);
              setEmail(event.target.value);
              
            }} 
          />
          <Button 
            sx={{ mt: 1 }}
            variant='outlined'
            onClick={(e) => {
              e.preventDefault();
              sendEmail(email, partyName);
            }}
          >
            Invite
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            You can also invite friends later from your party dashboard.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Close</Button>
        </DialogActions>
      </Dialog>
        {/* Modal 'Name Group' //? also have add member search? send email invite? */}
          {/* Results Message */}
            {/* Failure //?  */}

            {/**Success Redirect Options: 
               * Create Itinerary, 
               * Create Budget, 
               * Add Members, 
               * Browse Suggestions,
               * Visit your group page  
            */}

    </React.Fragment>
  )
};

export default CreateGroup
