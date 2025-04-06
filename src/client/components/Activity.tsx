// import React, { FC, useState, useEffect } from 'react';
// import axios from 'axios';
// import { Container, Card, Box, Button, Typography, TextField } from '@mui/material';

// import { activity } from '../../../types/models.ts';

// type ActivityProps = {
//   act: activity;
//   getAllActivities: () => void;
//   editMode: boolean;
// };

// const Activity: FC<ActivityProps> = ({ act, getAllActivities, editMode }) => {
//   const [isEditing, setIsEditing] = useState(false);  // For toggling between view and edit mode
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);  // For error handling
//   const [editedActivity, setEditedActivity] = useState(act);  // For storing edited values

//   // Toggle edit mode
//   const toggleEdit = () => {
//     setIsEditing(prev => !prev);
//   };

//   const deleteAct = async () => {
//     try {
//       await axios.delete(`/api/activity/${act.id}`);
//       getAllActivities(); // Refresh the activities list after deletion
//     } catch (err) {
//       console.error(err);
//       setErrorMessage('Failed to delete the activity.');
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditedActivity(prev => ({
//       ...prev,
//       [name]: value, // Update the specific field of the activity
//     }));
//   };

//   const saveActivity = async () => {
//     try {
//       await axios.patch(`/api/activity/${act.id}`, editedActivity);
//       getAllActivities(); // Refresh the activities list after saving
//       setIsEditing(false); // Exit edit mode
//     } catch (err) {
//       console.error(err);
//       setErrorMessage('Failed to save the activity.');
//     }
//   };

//   // Destructure the activity object for cleaner JSX
//   const { id, description, time, date, location, image, phone, address } = editedActivity;

//   return (
//     <Container>
//       <Card variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
//         <Typography variant="h6">{id}</Typography>

//         {/* Editable fields when in editing mode */}
//         {isEditing ? (
//           <Box>
//             <TextField
//               label="Description"
//               name="description"
//               value={description}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Time"
//               name="time"
//               value={time}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Date"
//               name="date"
//               value={date}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Location"
//               name="location"
//               value={location}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Phone"
//               name="phone"
//               value={phone}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Address"
//               name="address"
//               value={address}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//             />
//           </Box>
//         ) : (
//           // Display the activity details when not in editing mode
//           <Box>
//             <Typography variant="body1">{description}</Typography>
//             <Typography variant="body2">{time}</Typography>
//             <Typography variant="body2">{date}</Typography>
//             <Typography variant="body2">{location}</Typography>
//             <img
//               src={image}
//               alt="Activity"
//               width="200"
//               height="200"
//               style={{ marginBottom: 10 }}
//             />
//             <Typography variant="body2">{phone}</Typography>
//             <Typography variant="body2">{address}</Typography>
//           </Box>
//         )}

//         {errorMessage && <Typography color="error">{errorMessage}</Typography>}

//         {/* Edit/Save button */}
//         {editMode && (
//           <Button onClick={toggleEdit}>
//             {isEditing ? 'Save' : 'Edit'}
//           </Button>
//         )}

//         {/* Save the changes */}
//         {isEditing && (
//           <Button onClick={saveActivity} color="primary">
//             Save Changes
//           </Button>
//         )}

//         {/* Delete button */}
//         <Button onClick={deleteAct} color="error">
//           Delete
//         </Button>
//       </Card>
//     </Container>
//   );
// };

// export default Activity;
