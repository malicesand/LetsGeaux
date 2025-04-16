import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './client/components/App';
import { SnackbarProvider } from 'notistack';
import { BudgetNotificationProvider } from './client/components/BudgetBuddy/BudgetNotificationContext';
import { UserProvider } from './client/components/UserContext';
const root = createRoot(document.getElementById('root'));
document.body.style.backgroundColor = '#fdfd96';

root.render(
  <BrowserRouter>
    <SnackbarProvider maxSnack={3}>
      <BudgetNotificationProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </BudgetNotificationProvider>
    </SnackbarProvider>
  </BrowserRouter>
);