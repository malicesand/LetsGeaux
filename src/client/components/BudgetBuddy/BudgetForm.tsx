import React, { useState } from 'react';
import api from './api';
import { TextField, Button, Stack } from '@mui/material';

const BudgetForm: React.FC = () => {
  const [totalBudget, setTotalBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');
//allow users to create new budget entries
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/', { totalBudget, currency, notes })
      .then(() => window.location.reload())
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Total Budget"
          value={totalBudget}
          onChange={e => setTotalBudget(e.target.value)}
          type="number"
          required
        />
        <TextField
          label="Category"
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          required
        />
        <TextField
          label="Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Add Budget
        </Button>
      </Stack>
    </form>
  );
};

export default BudgetForm;