import React, { useState } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SendIcon from '@mui/icons-material/SendRounded';

import ChatHistory from './ChatHistory.tsx';
import { user } from '../../../../types/models.ts';

interface ChatProps {
  user: user;
}
const FullScreenChat: React.FC<ChatProps> = ({ user }) => {
  const [chatLog, setChatLog] = useState<{ text: string; user: boolean }[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const theme = useTheme();
  // const isMobile = true;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = () => {
    if (!userMessage.trim()) return;
    setChatLog(prev => [...prev, { text: userMessage, user: true }]);
    setUserMessage('');
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: isMobile ? '100%' : '700px',
        height: isMobile ? '90vh' : '85vh',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid black',
        boxShadow: '4px 4px 0px black',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: '#a684ff',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          backgroundColor: '#bbf451',
          borderBottom: '4px solid black',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography
          variant='h4'
          sx={{ fontFamily: 'Lexend Mega', color: 'black' }}
        >
          Gata Bot
        </Typography>
        <IconButton
          onClick={() => setIsHistoryOpen(true)}
          sx={{ color: 'black' }}
        >
          ☰
        </IconButton>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          px: 2,
          pt: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {chatLog.map((msg, idx) => (
          <Typography
            key={idx}
            sx={{
              maxWidth: '75%',
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: msg.user ? '#fff' : '#e6e6e6',
              alignSelf: msg.user ? 'flex-end' : 'flex-start',
              mb: 1,
              fontSize: '1rem',
              color: 'black',
              boxShadow: '2px 2px 0px black'
            }}
          >
            {msg.text}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          pb: 2,
          pt: 1,
          backgroundColor: '#a684ff'
        }}
      >
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          variant='standard'
          value={userMessage}
          onChange={e => setUserMessage(e.target.value)}
          placeholder='Type your message...'
          InputProps={{
            disableUnderline: true,
            sx: {
              backgroundColor: '#fff',
              borderRadius: '24px',
              px: 2,
              py: 1,
              fontFamily: 'inherit',
              fontSize: '1rem',
              boxShadow: '2px 2px 0px black',
              color: 'black'
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <IconButton onClick={handleSubmit} sx={{ ml: 1, color: '#bbf451' }}>
          <SendIcon sx={{ fontSize: '2rem', transform: 'translateY(-4px)' }} />
        </IconButton>
      </Box>
      
        <Drawer
          anchor='right'
          open={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          slotProps={{
            paper: {
              sx: {
                width: isMobile ? '300px' : 400,
                height: 'calc(90% - 100px)',
                mt: '110px',
                borderLeft: '4px solid black',
                borderTop: '4px solid black',
                boxShadow: '4px 4px 0px black',
                p: 2,
                backgroundColor: '#fff085',
                borderRadius: 4
              }
            }
          }}
        >
          <Typography
            variant='h6'
            gutterBottom
            sx={{ fontFamily: 'Lexend Mega' }}
          >
            Chat History
          </Typography>
          <ChatHistory user={user} />
        </Drawer>
        
    </Box>
  );
};

export default FullScreenChat;
