import React, { useState, useEffect } from 'react';
import axios from 'axios'

import TextField from '@mui/material/TextField';

import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';

import { styled } from '@mui/material/styles';

import { user } from '../../../../types/models.ts'
import { useParty } from './PartyContext';
 
const filter = createFilterOptions<user>();

const SearchWrapper = styled('div')(() => ({
  position: 'absolute',
  left: '60%',
  bottom: '70%',
  width: 300,
}));

// interface AddMemberProps {
//   user: user;
// }


const AddMember: React.FC = () => {
  const [users, setUsers] =  useState<user[]>([])
  // const [member, setMember] = useState<user>()
  // const[userId, setUserId] = useState<user['id']>()
  const { partyId } = useParty();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async() => {
    try {
      const response = await axios.get('/api/users');
      console.log('got the users');
      setUsers(response.data);
      
    } catch (error) {
      console.error('failed to get users for add Member search', error)
    };
  };

  const addUserToParty = async(userId:number, partyId:number) => {
    console.log(partyId)
    console.log(userId);
    try {
      let response = await axios.post('/api/group/userParty', {userId, partyId});
      console.log(response.data);
    } catch (error) {
      console.error('Could not create new userParty model', error);
    }
  }; 

  return (
    
    
    <SearchWrapper>
      <Autocomplete
        id="user-search"
        freeSolo
        options={users}
        getOptionLabel={(user: user) => user.username}
        onChange={(event, value: user) => {
          if (value) {
            // console.log('Selected user:', value);
            const userId = value.id;
            addUserToParty(userId, partyId);
          }
        }}
        openOnFocus={false}
        filterOptions={(options, state) => 
          state.inputValue === '' ? [] : filter(options, state)
        }
        renderInput={(params) => 
          <TextField 
            {...params} 
            placeholder="Search for a user..." 
           
        />}
      />

    </SearchWrapper>

   
  ) 
}

export default AddMember;