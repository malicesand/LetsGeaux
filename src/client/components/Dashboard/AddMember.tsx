import React, { useState, useEffect } from 'react';
import axios from 'axios'

import TextField from '@mui/material/TextField';
import Modal  from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
// import { styled } from '@mui/material/styles';

import { user } from '../../../../types/models.ts'
 
const filter = createFilterOptions<user>();

interface AddMemberProps {
  user: user;
  partyId: number;
  partyName: string;
  getMembers: (param: number) => void;
}


const AddMember: React.FC<AddMemberProps> = ({user, partyId, partyName, getMembers}) => { 
  const [users, setUsers] =  useState<user[]>([])
  const [member, setMember] = useState<user['username']>()
  const[userId, setUserId] = useState<user['id']>()
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    getUsers(); // ? DELETED partyId: number
  }, []);

  // * Modal: Add Member Confirmation * //
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };

  // * Fetch all Users with Let's Geaux Accounts * //
  const getUsers = async() => { // ? DELETED partyId: number
    try {
      const response = await axios.get('/api/users'); 
      setUsers(response.data);     
    } catch (error) {
      console.error('failed to get users for add Member search', error)
    };
  };
  // * Modal Button Click Handler * //
  const addMemberToParty = async(userId:number, partyId:number) => {
    try {
      await axios.post('/api/party/userParty', {userId, partyId}); 
      getMembers(partyId);
    } catch (error) {
      console.error('Could not create new userParty model', error);
    }
  }; 

  return ( 
    <React.Fragment>
      <Box sx={{ width: '100%', maxWidth: 300 }}>
        <Autocomplete
          id="user-search"
          freeSolo
          options={users}
          getOptionLabel={(user: user) => user.username}
          onChange={(event, value: user) => {
            if (value) {
              setMember(value.username)
              setUserId(value.id)
              openModal()
            }
          }}
          openOnFocus={false}
          filterOptions={(options, state) => 
            state.inputValue === '' ? [] : filter(options, state)
          }
          renderInput={(params) => 
            <TextField 
              {...params} 
              placeholder="Add an existing user to your party" 
          />}
        />
      </Box>
      <Modal
        open={open}
        onClose={closeModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderColor: 'secondary',
            p: 4,
            textAlign: 'center',
          }}>
            <Typography  variant="h6" component="h3">
              Would you like to add {member} to {partyName}?
            </Typography>
            <Box mt={2} display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                onClick={() => {
                  if (userId && partyId) {
                    addMemberToParty(userId, partyId);
                    closeModal();
                  }
                }}
              >
                Confirm
              </Button>
              <Button variant="contained" onClick={closeModal}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    
    </React.Fragment>


  ) 
}

export default AddMember;