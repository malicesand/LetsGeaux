
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import Calendar from './Calendar';

const CalendarPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const partyId = location.state?.partyId;

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    if (startDate && endDate) {
      // selectedDates  handled by the Calendar component 
    }
  }, [startDate, endDate]);

  if (!partyId) {
    return <Typography color="error">No party selected</Typography>;
  }

  return (
    <Container>
      <Calendar
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setSelectedDates={setSelectedDates}
      />
      {startDate && endDate && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            onClick={() =>
              navigate('/itinerary', {
                state: {
                  partyId,
                  begin: startDate.toDate().toISOString(),
                  end: endDate.toDate().toISOString(),
                  selectedDates,
                },
              })
            }
          >
            Continue to Itinerary
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default CalendarPage;
