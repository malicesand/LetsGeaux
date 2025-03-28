import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
 import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
  import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';



  
 const Calender: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date[]>([]);
const navigate = useNavigate();

const handleDateChange = (newDate: Date | null) => {
  if (newDate) {
    setSelectedDate((prevDates) => {
      const dateString = newDate.toDateString();
      const exists = prevDates.some(date => date.toDateString() === dateString);
      if (exists) {
        // Deselect the date if already selected
        return prevDates.filter(date => date.toDateString() !== dateString);
      } else {
        // Add the date if not already selected
        return [...prevDates, newDate];
      }
    });
  }
};



const handleRedirect = () => {
  if (selectedDate.length) {

// redirect to itinerary page once days are selected
navigate('/itinerary', { state: { selectedDates: selectedDate } })
 }
}



const CustomPickersDay = (props: PickersDayProps<Date>) => {
  const { day, selected, ...rest } = props;
  const isSelected = selectedDate.some(
    (selectedDate) => selectedDate.toDateString() === day.toDateString()
  );
  return <PickersDay {...rest} day={day} selected={isSelected} />;
};


return(
<LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Calendar View
        </Typography>

        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
        <DateCalendar
  value={null} 
  onChange={handleDateChange}
  views={['day']} 
  slots={{
    day: CustomPickersDay, 
  }}
/>

        </Box>

        {selectedDate.length > 0 && (
           <Typography variant="h6" align="center" color="primary" mt={2}>
            Selected: {selectedDate.map(date => date.toLocaleDateString()).join(", ")}
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