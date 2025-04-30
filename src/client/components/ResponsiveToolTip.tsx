import React from 'react';
import { Tooltip, Typography, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';

interface ResponsiveTooltipProps {
  title: string;
  children: React.ReactNode;
  // onClick?: () => void;
}

const ResponsiveTooltip: React.FC<ResponsiveTooltipProps> = ({ title, children}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return isMobile ? (
    <Box display="flex" alignItems="center" gap={1}>
      {/* <IconButton onClick={onClick}>{icon}</IconButton> */}
      {children}
      <Typography
        variant="body2"
        sx={{
          fontStyle: 'italic',
          opacity: 0.7,
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {title}
      </Typography>
    </Box>
  ) : (
    <Tooltip title={title}>
      <Box>{children}</Box>
    </Tooltip>
  );
};

export default ResponsiveTooltip;
