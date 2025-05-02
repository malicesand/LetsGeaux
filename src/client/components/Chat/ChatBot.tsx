import React, { useState, useEffect } from 'react';
import ResumeSessionPrompt from './ResumeSessionPrompt'; 
import FullScreenChat from './FullScreenChat'; 
import { Box } from '@mui/material';
import { user } from '../../../../types/models.ts';

// interface ChatMessage {
//   text: string;
//   user: boolean;
// }

interface BotProps {
  user: user;
}

const ChatBot: React.FC<BotProps> = ({ user }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [showSessionPrompt, setShowSessionPrompt] = useState(false);

  // On mount, decide whether to prompt or start fresh
  useEffect(() => {
    const stored = localStorage.getItem('sessionId');
    if (stored) {
      setPendingSessionId(stored);
      setShowSessionPrompt(true);
    } else {
      startNewSession();
    }
  }, []);

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
      setShowSessionPrompt(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {showSessionPrompt ? (
        <ResumeSessionPrompt
          onResume={resumeSession}
          onStartNew={startNewSession}
        />
      ) : (
        sessionId && (
          <FullScreenChat
            sessionId={sessionId} user={user}
          />
        )
      )}
    </Box>
  );
};

export default ChatBot;