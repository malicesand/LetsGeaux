import React, { useState, useEffect } from 'react';
import axios from 'axios'

import TextField from '@mui/material/TextField';
import Modal  from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { user } from '../../../../types/models.ts'

import Itinerary from '../Itinerary/Itinerary';

interface AddItineraryProps {
  user: user;
  partyId: number;
  partyName: string;
}

const AddItinerary: React.FC<AddItineraryProps>= ({ user, partyId, partyName }) => {
  const [open, setOpen] = React.useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleClick = () => {

  };

  return (
    <React.Fragment>
      <Button variant='contained' onClick={openModal}>
        Add a Shared Itinerary
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
              handleClick();
            }
          }
        }}
      >
       <DialogTitle>Travel Party Itinerary</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do want to choose an existing itinerary or create a new one?
          </DialogContentText>
          <DialogActions>
            <Button type='submit'>Create</Button>
            <Button type='submit'>Choose</Button>
          </DialogActions>
          <Divider/>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default AddItinerary;