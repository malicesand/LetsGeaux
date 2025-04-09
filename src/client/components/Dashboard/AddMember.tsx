import React, { useState, useEffect } from 'react';
import axios from 'axios'

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';

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
}


const AddMember: React.FC<AddMemberProps> = () => {
  const [users, setUsers] =  useState<user[]>([])
  const [member, setMember] = useState<user>()

  useEffect(() => {
    getUsers();
  });

  const getUsers = async() => {
    try {
      const response = await axios.get('/api/users');
      // console.log('got the users', response.data);
      setUsers(response.data)
      
    } catch (error) {
      console.error('failed to get users for add Member search', error)
    }
  }
  return (
    
    
    <SearchWrapper>
      <Autocomplete
        id="user-search"
        freeSolo
        options={users}
        getOptionLabel={(user: user) => user.username}
        onChange={(event, value: user) => {
          if (value) {
            console.log('Selected user:', value);
            setMember(value)
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