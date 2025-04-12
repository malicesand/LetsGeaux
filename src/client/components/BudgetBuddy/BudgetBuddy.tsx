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
import BudgetPDFPrintout from './BudgetPDFPrintout';

const BudgetBuddy: React.FC = () => {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<number | null>(null);

  //add budgets state to store fetched budget entries
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loadingBudgets, setLoadingBudgets] = useState<boolean>(false);

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
//fetch budgets whenever selectedItineraryId changes.
useEffect(() => {
  const fetchBudgets = async () => {
    if (!selectedItineraryId) return;
    setLoadingBudgets(true);
    try {
      const res = await api.get(`/budget?partyId=${selectedItineraryId}`);
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setBudgets(data);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
      setBudgets([]);
    } finally {
      setLoadingBudgets(false);
    }
  };
  fetchBudgets();
}, [selectedItineraryId]);

//compute currentBudget and budgetBreakdown from the fetched budgets
const currentBudget = budgets.reduce((acc, b) => acc + (Number(b.spent) || 0), 0);
const budgetBreakdown = budgets.map((b) => ({
  name: b.category,
  spent: Number(b.spent) || 0,
  limit: Number(b.limit),
}));

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
       {/*render the PDF Printout component with real data */}
      {selectedItineraryId && (
        <Box sx={{ my: 3 }}>
          <Paper elevation={6} sx={{ p: 4 }}>
            <BudgetPDFPrintout
              // pass the actual itinerary object from the itineraries array
              itinerary={itineraries.find((it) => it.id === selectedItineraryId) || { name: 'Unknown Trip' }}
              // pass the computed budget breakdown from the budgets state
              budgetBreakdown={budgetBreakdown}
              // pass the computed current budget
              currentBudget={currentBudget}
            />
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default BudgetBuddy;
