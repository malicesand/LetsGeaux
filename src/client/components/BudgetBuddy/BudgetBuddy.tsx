import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import BudgetOverview from './BudgetOverview';
import BudgetForm from './BudgetForm';
import BudgetCategories from './BudgetCategories';
//layout for budget page
//keep track of organizing sub components
const BudgetBuddy: React.FC = () => {
  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h3" gutterBottom align="center">
        budgetBuddy
      </Typography>

      {/* Budget Summary */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        
      </Paper>

      {/* Budget creation form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <BudgetForm />
      </Paper>

      {/* budget categories */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <BudgetCategories />
      </Paper>
    </Container>
  );
};

export default BudgetBuddy;
