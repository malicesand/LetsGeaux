import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './client/components/App';
import { SnackbarProvider } from 'notistack';
import { BudgetNotificationProvider } from './client/components/BudgetBuddy/BudgetNotificationContext';
import { UserProvider } from './client/components/UserContext';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../';
const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
   <ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={3}>
      <BudgetNotificationProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </BudgetNotificationProvider>
    </SnackbarProvider>
   </ThemeProvider>
  </BrowserRouter>
);