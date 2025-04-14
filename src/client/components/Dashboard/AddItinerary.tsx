// import React, { useState, useEffect } from 'react';
// import axios from 'axios'

// import TextField from '@mui/material/TextField';
// import Modal  from '@mui/material/Modal';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogActions from '@mui/material/DialogActions';
// import Divider from '@mui/material/Divider';
// import Typography from '@mui/material/Typography';
// import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
// import Box from '@mui/material/Box';
// import { styled } from '@mui/material/styles';

// import { user } from '../../../../types/models.ts'

// import Itinerary from '../Itinerary/Itinerary';

// interface AddItineraryProps {
//   user: user;
//   partyId: number;
//   partyName: string;
// }

// const AddItinerary: React.FC<AddItineraryProps>= ({ user, partyId, partyName }) => {
//   const [open, setOpen] = React.useState(false);

//   const openModal = () => {
//     setOpen(true);
//   };

//   const closeModal = () => {
//     setOpen(false);
//   };

//   const handleClick = () => {

//   };

//   return (
//     <React.Fragment>
//       <Button variant='contained' onClick={openModal}>
//         Add a Shared Itinerary
//       </Button>
//       <Dialog
//         open={open}
//         onClose={closeModal}
//         slotProps={{
//           paper: {
//             sx: { width: 500 },
//             component: 'form',
//             onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
//               e.preventDefault();
//               handleClick();
//             }
//           }
//         }}
//       >
//        <DialogTitle>Travel Party Itinerary</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Do want to choose an existing itinerary or create a new one?
//           </DialogContentText>
//           <DialogActions>
//             <Button type='submit'>Create</Button>
//             <Button type='submit'>Choose</Button>
//           </DialogActions>
//           <Divider/>
//         </DialogContent>
//       </Dialog>
//     </React.Fragment>
//   );
// };

// export default AddItinerary;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Box,
  Typography
} from '@mui/material';

import { user } from '../../../../types/models';

interface AddItineraryProps {
  user: user;
  partyId: number;
  partyName: string;
}

const AddItinerary: React.FC<AddItineraryProps> = ({ user, partyId, partyName }) => {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(`/api/itinerary?userId=${user.id}`);
        setItineraries(response.data);
      } catch (err) {
        console.error('Error fetching itineraries:', err);
      }
    };

    fetchItineraries();
  }, [user.id]);

  const handleChoose = () => {
    if (selectedItinerary) {
      navigate(`/itinerary/${selectedItinerary.id}`);
    }
  };

  useEffect(()=>{
    console.log('party', partyId)
    console.log(typeof partyId)
  })
  const handleCreate = (e: React.MouseEvent, partyId: number) => {
    e.preventDefault();
    navigate('/itinerary', { state: { partyId } });
  };
  

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add a Shared Itinerary
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Travel Party Itinerary</DialogTitle>

        <DialogContent>
          <Typography gutterBottom>Choose an existing itinerary or create a new one for the party <strong>{partyName}</strong>.</Typography>

          <TextField
            fullWidth
            select
            label="Select an Itinerary"
            value={selectedItinerary?.id || ''}
            onChange={(e) => {
              const selected = itineraries.find(i => i.id === parseInt(e.target.value));
              setSelectedItinerary(selected || null);
            }}
            sx={{ mt: 2 }}
          >
            <MenuItem value="">-- Select --</MenuItem>
            {itineraries.map(itinerary => (
              <MenuItem key={itinerary.id} value={itinerary.id}>
                {itinerary.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleChoose} disabled={!selectedItinerary}>
            Choose
          </Button>
          <Button onClick={(e) => handleCreate(e, partyId)} variant="contained" color="primary">
            Create New Itinerary
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddItinerary;
