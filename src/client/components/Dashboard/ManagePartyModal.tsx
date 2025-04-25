// import React, {useEffect} from 'react';
// import axios from 'axios';


// import TextField from '@mui/material/TextField';
// import Modal  from '@mui/material/Modal';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
// import Fade from '@mui/material/Fade';
// import Backdrop from '@mui/material/Backdrop';
// import Box from '@mui/material/Box';


// import { user } from '../../../../types/models.ts'

// interface ManagePartyProps {
//   open: boolean,
//   onClose: () => void;
//   user: user;
//   partyId: string;
//   partyName: string;
//   partyMembers: user[];
//   onRename: (newName: string) => void;
//   onRemoveMembers: (memberIds: number[]) => void;
//   onLeave: () => void;
// }

// const ManageParty: React.FC<ManagePartyProps> = ({user, partyId, partyName, partyMembers, onRename, onRemoveMembers}) => {
//   const userId = user.id;
//   // const

//   useEffect(() => {
//     console.log(partyId);
//     console.log(userId);
//     console.log(partyName);
//     console.log(partyMembers);

//   })

//   // * Delete Members From A Party * //
//   const deleteMembers = async (userId: number, partyId: string) => {
//     // console.log(`Deleting user${userId} from party ${partyId}  `);
//     try {
//       const response = await axios.get(`/api/party/:userId/:partyId`);
//       // console.log(`user: ${userId} removed from party: ${partyId}`);
//     } catch (error) {
//       console.error(
//         `Failed to remove user ${userId} from party ${partyId}:`,
//         error
//       );
//     }
//   };

//   // * Rename Party *//
//   const renameParty = async (partyId: string, newName: string) => {
//     try {
//       await axios.patch(`/api/party/${partyId}`, {name: newName});
//     } catch (error) {
//       console.error(`Failure: rename party${partyId} to ${newName} `)
//     }
//   }


//   return (
//     <div></div>
//   )
// }

// export default ManageParty;

import React, { useState } from 'react';
import {
  Dialog,
  Typography,
  TextField,
  Box,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Button,
  DialogActions,
  DialogContent
} from '@mui/material';
import { PiTrashDuotone } from 'react-icons/pi';
import {user} from  '../../../../types/models.ts';

type Member = {
  id: number;
  username: string;
  avatar: string;
};

type ManagePartyModalProps = {
  user: user;
  open: boolean;
  onClose: () => void;
  partyName: string;
  members: Member[];
  partyId: number;
  onRename: (partyId: number, newName: string) => void;
  onRemoveMembers: (partyId:number, memberId: number) => void;
  onLeave: (partyId: number, memberId: number) => void;
};

const ManagePartyModal = ({
  user,
  open,
  onClose,
  partyName,
  members,
  partyId,
  onRename,
  onRemoveMembers,
  onLeave,
}: ManagePartyModalProps) => {
  const [newName, setNewName] = useState(partyName);
  const [markedForRemoval, setMarkedForRemoval] = useState<number[]>([]);

  const toggleMember = (id: number) => {
    setMarkedForRemoval(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (newName !== partyName) {
      onRename(partyId, newName);
    }
    if (markedForRemoval.length > 0) {
      markedForRemoval.map((member) => {
        onRemoveMembers(member, partyId);
      })
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <Typography variant='subtitle1' sx={{ mt: 2 }}>
          Change Party Name
        </Typography>
        <TextField
          fullWidth
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder='New Party Name'
        />

        <Typography variant='subtitle1' sx={{ mt: 3 }}>
          Remove Members
        </Typography>
        <Box component='ul' sx={{ listStyle: 'none', pl: 0 }}>
          {members.map(member => (
            <ListItem
              key={member.id}
              secondaryAction={
                <IconButton
                  edge='end'
                  aria-label='delete'
                  onClick={() => toggleMember(member.id)}
                  color={markedForRemoval.includes(member.id) ? 'error' : 'default'}
                >
                  <PiTrashDuotone />
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

        <Typography variant='subtitle1' sx={{ mt: 3 }}>
          Leave Party
        </Typography>
        <Checkbox variant='contained' onClick={onLeave}>
          Leave This Party
        </Checkbox>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='contained' onClick={handleConfirm}>
          Confirm Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManagePartyModal;
