import React, { useState } from 'react';
import api from './api';
import { TextField, Button, Stack, Box } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface BudgetFormProps {
  selectedItineraryId: number | null;

 //callback that the parent can supply to refresh data after a budget is added
 onBudgetAdded?: () => void;
}
const BudgetForm: React.FC<BudgetFormProps> = ({ selectedItineraryId, onBudgetAdded }) => {
  const [limit, setLimit] = useState('');
  const [spent, setSpent] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedLimit = parseFloat(limit);
    const parsedSpent = parseFloat(spent) || 0;

    if (isNaN(parsedLimit)) {
      return alert('Please enter a valid number for the budget.');
    }

    try {
      await api.post('/budget', {
        limit: parsedLimit,
        spent: parsedSpent,
        category,
        notes,
        partyId: selectedItineraryId, // now using partyId instead of itineraryId
      });

      // Reset form
      setLimit('');
      setSpent('');
      setCategory('');
      setNotes('');
   // call the parents callback to re fetch budgets immediately
   if (onBudgetAdded) {
    onBudgetAdded();
  }
} catch (err) {
  console.error('Failed to submit budget:', err);
}
};

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField
          label="Total Budget"
          value={limit}
          type="number"
          required
          fullWidth
          onChange={(e) => setLimit(e.target.value)}
        />
        <TextField
          label="Amount Spent"
          value={spent}
          type="number"
          fullWidth
          onChange={(e) => setSpent(e.target.value)}
        />
<FormControl fullWidth required>
  <InputLabel>Category</InputLabel>
  <Select
    value={category}
    label="Category"
    onChange={(e) => setCategory(e.target.value)}
  >
    {['Food', 'Travel', 'Lodging', 'Exploring', 'Misc'].map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </Select>
</FormControl>
  <TextField
          label="Notes"
          value={notes}
          multiline
          fullWidth
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Add Budget
        </Button>
      </Stack>
    </Box>
  );
};

export default BudgetForm;
