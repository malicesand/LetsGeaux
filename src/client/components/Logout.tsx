import React from 'react';
import { Box, Typography, Button, Card } from '@mui/material';
import { PiArrowSquareRightBold } from "react-icons/pi";

const Logout: React.FC = () => {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f0f0f0"
      p={2}
    >
      <Card
        sx={{
          border: '4px solid black',
          borderRadius: 8,
          padding: 4,
          maxWidth: 400,
          textAlign: 'center',
          backgroundColor: '#fff',
        }}
      >
        <PiArrowSquareRightBold size={100} />
        <Typography variant="h4" gutterBottom>
          You’ve been logged out
        </Typography>
        <Typography variant="body1" mb={3}>
          Thanks for stopping by.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/auth/google"

        >
          Log Back In
        </Button>
      </Card>
    </Box>
  );
};

export default Logout;
