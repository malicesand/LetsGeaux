import React, { useState } from 'react';
import api from './api';
import { TextField, Button, Stack, Box } from '@mui/material';

const BudgetForm: React.FC = () => {
  const [limit, setLimit] = useState('');
  const [category, setCategory] = useState('i.e Food, Travel');
  const [notes, setNotes] = useState('');
//allow users to create new budget entries
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit);
  if (isNaN(parsedLimit)) {
    return alert("Please enter a valid number for the budget.");
  }
    api.post('/', { limit: parsedLimit, category, notes })
      .then(() => window.location.reload())
      .catch(err => console.error(err));
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
          onChange={e => setLimit(e.target.value)}
        />
        <TextField
          label="Category"
          value={category}
          required
          fullWidth
          onChange={e => setCategory(e.target.value)}
        />
        <TextField
          label="Notes"
          value={notes}
          fullWidth
          onChange={e => setNotes(e.target.value)}
        />
        <Button variant="contained" type="submit">Add Budget</Button>
      </Stack>
    </Box>
  );
};

export default BudgetForm;