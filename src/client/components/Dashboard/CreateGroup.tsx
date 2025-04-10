import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { user, party } from '../../../../types/models.ts'
interface groupProps {
  user: user;
}

const CreateGroup: React.FC<groupProps> = ({user}) => {
  const [open, setOpen] = React.useState(false);
  // const [name, setName] = useState<string>('');
  // const [partyId, setPartyId] = useState<number>(); 
  const userId = user.id;

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  
// * Request Handling * //
  const createParty = async (name:string) => {
    console.log(`Creating...${name}`);
    try {
      let response = await axios.post('/api/group', {name} );
      console.log(`${name} created!`)
      console.log(`${response.data.id} partyId!`)
      const partyId = (response.data.id) 
      addUserToParty(userId, partyId);
    } catch (error) {
      console.error('failed to create new group');
    };
  };
  const addUserToParty = async(userId:number, partyId:number) => {
    console.log(`this is a partyId:${partyId}`);
    try {
      let response = await axios.post('/api/group/userParty', {userId, partyId});
      console.log(`userParty logged ${response.data}`);
    } catch (error) {
      console.error('Could not create new userParty model', error);
    }
  }; 

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
              // console.log(e.currentTarget);
              const formData = new FormData(e.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              // console.log(formJson, 'the form');
              // setName(formJson.party);
              // console.log(name, 'name on dom');
              closeModal();
              createParty(formJson.party);
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
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button type='submit'>Create</Button>
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
