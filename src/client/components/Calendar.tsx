import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { isBefore, isAfter, isSameDay } from 'date-fns';
import { eachDayOfInterval } from 'date-fns';


const Calender: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  // Handle date change and determine start and end dates
  const handleDateChange = (newDate: Date | null) => {
    if (!startDate) {
      // Set the start date if it's not already set
      setStartDate(newDate);
    } else if (!endDate) {
      // If start date is set, set the end date
      if (isAfter(newDate, startDate)) {
        setEndDate(newDate);
      } else {
        // If new date is earlier, reset to allow re-selection of the range
        setStartDate(newDate);
        setEndDate(null);
      }
    } else if (isSameDay(newDate, startDate) || isSameDay(newDate, endDate)) {
      // If the clicked date is already selected, reset the entire range
      setStartDate(null);
      setEndDate(null);
    } else {
      // Update range when a new date is selected
      if (isBefore(newDate, startDate)) {
        setStartDate(newDate);
        setEndDate(null); // Clear the end date if the new start date is earlier
      } else if (isAfter(newDate, endDate!)) {
        setEndDate(newDate);
      }
    }
  };

  // Function to highlight the range of days
  const CustomPickersDay = (props: PickersDayProps<Date>) => {
    const { day, selected, ...rest } = props;

    const isInRange = startDate && endDate && isAfter(day, startDate) && isBefore(day, endDate);
    const isSelected = isSameDay(day, startDate) || isSameDay(day, endDate) || isInRange;

    return (
      <PickersDay
        {...rest}
        day={day}
        selected={isSelected}
        sx={{
          backgroundColor: isSelected ? 'primary.main' : 'transparent',
          '&:hover': {
            backgroundColor: 'primary.light',
          },
        }}
      />
    );
  };

  // Handle redirect with the selected dates
  const handleRedirect = () => {
    if (startDate && endDate) {
      // Generate the full range of dates between startDate and endDate
      const allDates = eachDayOfInterval({ start: startDate, end: endDate });
  
      // Redirect with all selected dates
      navigate('/itinerary', { state: { selectedDates: allDates } });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Typography variant="h4" gutterBottom>
        Choose Days For Trip
        </Typography>

        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
          <DateCalendar
            value={startDate || endDate} // Make the calendar show the selected date
            onChange={handleDateChange}
            views={['day']}
            slots={{
              day: CustomPickersDay, // Pass custom day renderer
            }}
          />
        </Box>

        {startDate && endDate && (
          <Typography variant="h6" align="center" color="primary" mt={2}>
            Selected Range: {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
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


