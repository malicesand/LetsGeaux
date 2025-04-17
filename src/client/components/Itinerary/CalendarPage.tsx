
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendar from './Calendar';

const CalendarPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get partyId from navigation state
  const partyId = location.state?.partyId;

  if (!partyId) {
    return <div>Error: No party selected.</div>;
  }

  return (
    <Calendar
      partyId={partyId}
      onSubmit={(startDate, endDate) => {
        // Navigate to the itinerary creation page, passing selected data
        navigate('/itinerary', {
          state: {
            partyId,
            begin: startDate.toISOString(),
            end: endDate.toISOString()
          }
        });
      }}
    />
  );
};

export default CalendarPage;
