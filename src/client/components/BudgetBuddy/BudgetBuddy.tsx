import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';

import BudgetOverview from './BudgetOverview';
import BudgetForm from './BudgetForm';
import BudgetPieChart from './BudgetPieChart';
import api from './api';

const BudgetBuddy: React.FC = () => {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        // confirm this filters by creatorId
        const res = await api.get('/itinerary');
        console.log("Fetched itineraries:", res.data); //inspect this for debug
        setItineraries(res.data);
      } catch (err) {
        console.error('Failed to fetch itineraries:', err);
        // fallback to avoid crash
        setItineraries([]);
      }
    };

    fetchItineraries();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Budget Buddy
      </Typography>

      {/* dropdown for selecting an itinerary */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Itinerary</InputLabel>
          <Select
            value={selectedItineraryId ?? ''}
            onChange={(e) => setSelectedItineraryId(Number(e.target.value))}
            label="Select Itinerary"
          >
            {itineraries.map((itinerary) => (
              <MenuItem key={itinerary.id} value={itinerary.id}>
                {itinerary.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ my: 3 }}>
        <Paper elevation={6} sx={{ p: 4 }}>
          <BudgetOverview selectedItineraryId={selectedItineraryId} />
        </Paper>
      </Box>

      <Box sx={{ my: 3 }}>
        <Paper elevation={6} sx={{ p: 4 }}>
          <BudgetForm selectedItineraryId={selectedItineraryId} />
        </Paper>
      </Box>

      <Box sx={{ my: 3 }}>
        <Paper elevation={6} sx={{ p: 4 }}>
          <BudgetPieChart selectedItineraryId={selectedItineraryId} />
        </Paper>
      </Box>
    </Container>
  );
};

export default BudgetBuddy;
