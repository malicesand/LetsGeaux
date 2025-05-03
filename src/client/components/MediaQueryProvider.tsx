import React, { createContext, useContext } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

const MediaQueryContext = createContext({
  isMobile: false,
  isTablet: false,
  isDesktop: true
});

export const MediaQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:899px)');
  const isDesktop = useMediaQuery('(min-width:900px)');

  return (
    <MediaQueryContext.Provider value={{ isMobile, isTablet, isDesktop }}>
      {children}
    </MediaQueryContext.Provider>
  );
};

export const useMedia = () => useContext(MediaQueryContext);