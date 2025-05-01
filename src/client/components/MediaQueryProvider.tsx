import React, { createContext, useContext } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

const MediaQueryContext = createContext({
  isMobile: false,
  isTablet: false,
  isDesktop: true
});

export const MediaQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <MediaQueryContext.Provider value={{ isMobile, isTablet, isDesktop }}>
      {children}
    </MediaQueryContext.Provider>
  );
};

export const useMedia = () => useContext(MediaQueryContext);