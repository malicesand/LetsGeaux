import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './client/components/App';
import { SnackbarProvider } from 'notistack';
import { BudgetNotificationProvider } from './client/components/BudgetBuddy/BudgetNotificationContext';
import { UserProvider } from './client/components/UserContext';
import { MediaQueryProvider } from './client/components/MediaQueryProvider';
import { ThemeProvider } from '@mui/material/styles';
import theme1 from './client/theme/index'
const root = createRoot(document.getElementById('root'));
//import geometry from './client/theme/inspiration-geometry.png'
import { ImageProvider } from './client/components/ImageContext';
//import { Box } from '@mui/material';
import { ItineraryProvider } from './client/components/ItineraryContext';
document.body.style.backgroundColor = '#c4a1ff';
//document.body.style.backgroundImage = geometry
root.render(
  // <Box className='geometry'
  //   style={{
  //     backgroundImage: `url(${geometry})`,
  //     backgroundSize: "repeat",


  // }}>
  <BrowserRouter>
    {/* <ItineraryProvider> */}
    <ImageProvider>
      <MediaQueryProvider>
        <SnackbarProvider maxSnack={3}>
          <BudgetNotificationProvider>
            <UserProvider>
              <ThemeProvider theme={theme1}>
                <App />
              </ThemeProvider>
            </UserProvider>
          </BudgetNotificationProvider>
        </SnackbarProvider>
      </MediaQueryProvider>
    </ImageProvider>
    {/* </ItineraryProvider> */}
  </BrowserRouter >
  // </Box >
);