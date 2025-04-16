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
import { styled } from '@mui/material/styles';

import { user } from '../../../../types/models.ts'
 
const filter = createFilterOptions<user>();

const SearchWrapper = styled('div')(() => ({
  position: 'absolute',
  left: '60%',
  bottom: '70%',
  width: 300,
}));

interface AddMemberProps {
  user: user;
  partyId: number;
  partyName: string;
}


const AddMember: React.FC<AddMemberProps> = ({user, partyId, partyName}) => {
  const [users, setUsers] =  useState<user[]>([])
  const [member, setMember] = useState<user['username']>()
  const[userId, setUserId] = useState<user['id']>()
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    getUsers(partyId);
  }, []);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const getUsers = async(partyId: number) => {
    try {
      const response = await axios.get('/api/users');
      // console.log('got the users');
      setUsers(response.data);
      
    } catch (error) {
      console.error('failed to get users for add Member search', error)
    };
  };

  const addMemberToParty = async(userId:number, partyId:number) => {
    // console.log(partyId)
    // console.log(userId);
    try {
      let response = await axios.post('/api/party/userParty', {userId, partyId});
      // console.log(response.data);
    } catch (error) {
      console.error('Could not create new userParty model', error);
    }
  }; 

  return ( 
    <React.Fragment>
      <SearchWrapper>
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
              placeholder="Add a user to this party" 
          />}
        />
      </SearchWrapper>
      <div>
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
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}>
            <Typography  variant="h6" component="h2">
              Would you like to add {member} to {partyName}?
            </Typography>
            <Box mt={2} display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (userId && partyId) {
                    addMemberToParty(userId, partyId);
                    closeModal();
                  }
                }}
              >
                Confirm
              </Button>
              <Button variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      </div>
    </React.Fragment>


  ) 
}

export default AddMember;