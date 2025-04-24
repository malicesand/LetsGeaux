import React, { useEffect } from 'react';
import { Box, Button, Typography, Card } from '@mui/material';
import { PiGoogleLogoBold } from 'react-icons/pi'; // or from 'phosphor-react' if you're using that

const Login: React.FC = () => {
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
          borderRadius: 4,
          padding: 4,
          maxWidth: 400,
          textAlign: 'center',
          backgroundColor: '#c4a1ff',
        }}
      >
        <PiGoogleLogoBold size={100} style={{ marginBottom: '2rem' }} />

        <Typography variant="h4" gutterBottom>
          Sign in to Continue
        </Typography>

        <Button
          variant="contained"
          color="primary"
          href="/auth/google"

        >
          Login with Google
        </Button>
      </Card>
    </Box>
  );
};
export default Login;
