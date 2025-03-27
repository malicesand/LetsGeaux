import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
 import { TextField } from '@mui/material';
 import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
 import { DatePicker } from '@mui/x-date-pickers';
  import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';



  
 const Calender: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
const navigate = useNavigate();

const handleDateChange = (date: Date | null) => {
  setSelectedDate(date); 
};



const handleRedirect = () => {
  if (selectedDate) {
    const formattedDate = selectedDate.toISOString().split('T')[0]
// redirect to itinerary page once days are selected


navigate('/itinerary')
 }
}

return(
<LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Calendar View
        </Typography>

        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
          <DatePicker
                label="Pick a Date"
                value={selectedDate}
                onChange={handleDateChange}
                slots={{ textField: TextField }}
            slotProps={{
              textField: {
                label: "Pick a Date",
                variant: "outlined",
              },
            }}
          />
        </Box>

        {selectedDate && (
          <Typography variant="h6" color="primary" align="center">
              Selected Date: {selectedDate.toLocaleDateString()}

          </Typography>
        )}

        <Box display="flex" justifyContent="center" my={3}>
          <Button variant="contained" color="primary" onClick={handleRedirect}>
            Go to Itinerary
          </Button>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};
 export default Calender;