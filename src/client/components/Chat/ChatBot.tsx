import React, { useState, useEffect } from 'react';
import ResumeSessionPrompt from './ResumeSessionPrompt'; 
import FullScreenChat from './FullScreenChat'; 
import { CircularProgress } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { user } from '../../../../types/models.ts';

interface BotProps {
  user: user;
}

const ChatBot: React.FC<BotProps> = ({ user }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [showSessionPrompt, setShowSessionPrompt] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean | null>(null);
  

  // Get or create session on first load
  useEffect(() => {
    const stored = localStorage.getItem('sessionId');
    // console.log('localStorage sessionId found:', stored);
    if (stored) {
      setPendingSessionId(stored);
      setSessionId(stored);
    } else  {
      startNewSession();
    }
  }, []);

  // * Session Prompt Modal *//
  // Check if new user
  useEffect (() => {
    if (pendingSessionId && isFirstTimeUser === false) {
      setShowSessionPrompt(true);
    }
  }, [pendingSessionId, isFirstTimeUser]);

  // Modal New Session Handler
  const startNewSession = async () => {
    const res = await fetch('/api/chats/new-session', { method: 'POST' });
    const data = await res.json();
    
    localStorage.setItem('sessionId', data.sessionId);
    localStorage.removeItem('hasBeenGreeted');
    setSessionId(data.sessionId);
   
    setShowSessionPrompt(false);
  };

  const resumeSession = () => {
    if (pendingSessionId) {
      setSessionId(pendingSessionId);
      setTimeout(() => {
        console.log('sessionId after setting resume:', sessionId);
      }, 100); 
      setShowSessionPrompt(false);
    }
  };

   // Loading state while waiting for isFirstTimeUser to be set
  if (!sessionId) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#c4a1ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        gap: 2, }}>
          <CircularProgress color='primary' />
        <Typography variant="h6">Loading your session...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#c4a1ff' }}>
      {showSessionPrompt ? (
        <ResumeSessionPrompt
          onResume={resumeSession}
          onStartNew={startNewSession}
        />
      ) : (
        <FullScreenChat
          sessionId={sessionId}
          user={user}
          setIsFirstTimeUser={setIsFirstTimeUser}
          isFirstTimeUser={isFirstTimeUser}
        />
      )}
    </Box>
  );
};

export default ChatBot;