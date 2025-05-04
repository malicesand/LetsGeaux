import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface ResumeSessionPromptProps {
  onResume: () => void;
  onStartNew: () => void;
}
//TODO Should only render when user is not new 
const ResumeSessionPrompt: React.FC<ResumeSessionPromptProps> = ({ onResume, onStartNew }) => {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: '2px solid #bbf451',
        background: '#fff',
        maxWidth: 400,
        margin: '0 auto',
        textAlign: 'center',
        mt: 4,
        // border: '2px solid black',
        boxShadow: '4px 4px 0px black',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Welcome back!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Would you like to continue your last chat session or start a new one?
      </Typography>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={onResume}>
          Resume
        </Button>
        <Button variant="contained" onClick={onStartNew}>
          Start New
        </Button>
      </Box>
    </Box>
  );
};

export default ResumeSessionPrompt;
