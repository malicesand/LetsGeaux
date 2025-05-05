import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Drawer,
  Slide
} from '@mui/material';

import SendRounded from '@mui/icons-material/SendRounded';
import ChatHistory from './ChatHistory.tsx';

import { user, message } from '../../../../types/models.ts';
import { useMedia } from '../MediaQueryProvider.tsx';

interface ChatMessage {
  text: string;
  user: boolean;
}

interface ChatProps {
  user: user;
  sessionId: string;
  setIsFirstTimeUser: (val: boolean) => void;
  isFirstTimeUser: boolean | null;
}

const FullScreenChat: React.FC<ChatProps> = ({ 
  user, 
  sessionId, 
  setIsFirstTimeUser, 
  isFirstTimeUser  
}) => {
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const chatLogRef = useRef<HTMLDivElement>(null); 
  const [userMessage, setUserMessage] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); //history drawer
  const [hasNamedSession, setHasNamedSession] = useState(false);
  const [hasGreetedThisSession, setHasGreetedThisSession] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatHeight, setChatHeight] = useState<number>(0);
  const { isMobile } = useMedia(); 
  const [chatLogHydrated, setChatLogHydrated] = useState(false);
  
  //* On Component Mount *//
  // Focus on Mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  // Scroll Behavior
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // ✅ ← This is the key line
        });
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [chatLog]);
  
  // Fill Out Chat History When Resuming
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(`/api/chats/messages/${sessionId}`);
        const messages = res.data as message[]
        const formatted: ChatMessage[] = messages.flatMap(msg => [
          { text: msg.userMessage, user: true },
          { text: msg.botResponse, user: false }
        ]);
        // console.log('Setting chatLog from DB:', formatted);
        setChatLog(formatted);
        setChatLogHydrated(true);
      } catch (err) { 
        console.error('Failed to load chat history', err);
      }
    };

    if (sessionId) {
      fetchChatHistory();
    } 
  }, [sessionId]);

  // Greeting 
  useEffect(() => {
    if (!sessionId || isFirstTimeUser === null || hasGreetedThisSession || !chatLogHydrated ) return;
    // console.log(`is first time user? ${isFirstTimeUser}`)
    // console.log(`has greeted this session ${hasGreetedThisSession}`)
    // TODO set so does not greet if resuming
    // Only greet if no messages yet
    // if (chatLog.length === 0) {
      const greeting = isFirstTimeUser
        ? "Alright Cher! I'll be your local guide to the Big Easy. Here to help you find the best food, music, and spots to explore. Whether it’s your first visit or you’re just looking for hidden gems, I’ve got you. What kind of adventure are you in the mood for today?"
        : "Welcome back baby! What kind of adventure are you in the mood for today?";

      setChatLog(prev => [...prev, { text: greeting, user: false }]);
      setHasGreetedThisSession(true);
  }, [sessionId, isFirstTimeUser, hasGreetedThisSession, chatLogHydrated]);
   
  // Chat Container Height
  useEffect(() => {
    if (chatContainerRef.current) {
      setChatHeight(chatContainerRef.current.offsetHeight);
    }
  }, []);
  // Mobile Scroll
  useEffect(() => {
    if (isMobile && chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  //* Message Handling And Default Name*//
  const handleSubmit = async () => {
    if (!userMessage.trim()) return;
    setChatLog([...chatLog, { text: userMessage, user: true }]);

    setUserMessage('');
    try {
      const response = await axios.post('/api/chats', {
        userMessage,
        userId: user.id,
        sessionId
      });
      setChatLog(prev => [...prev, { text: response.data, user: false }]);

      // if (!hasNamedSession) {
      //   try {
      //     // console.log(`message inside naming ${userMessage}`)
      //     await axios.patch(`/api/chats/chat-history/${sessionId}`, {
      //       conversationName: userMessage
      //     });
      //     setHasNamedSession(true);
      //   } catch (err) {
      //     console.error('Failed to auto-name session:', err);
      //   }
      // };
    } catch (error: any) {
      // ? Type the error
      console.error('Error sending message:', error);
      setChatLog(prev => [
        ...prev,
        { text: 'Error: Could not get response.', user: false }
      ]);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c4a1ff', 
        // mx: 4,
      }}
    >
      <Box sx={{ display: 'flex', width: '100%', height: '100%', gap: isMobile ? 0 : 2 }}>
        {/* Main Chat Column */}
        <Box
          ref={chatContainerRef}
          sx={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '55%',
            height: isMobile ? '100%' : '85vh',
            // height: isMobile ? 'calc(100vh - 64px)' : '85vh',
            //height: isMobile ? '97dvh' : '85vh',
            margin: isMobile ? 0 : 1,
            // mx: 2,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            border: isMobile ? 'none': '2px solid black',
            boxShadow: isMobile ? 'none' : '4px 4px 0px black',
            borderRadius: '20px',
            overflow: 'hidden',
            backgroundColor: '#a684ff',
            position: 'relative'
          }}
        >
          {/* Header */}
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
              variant='h3'
              sx={{ fontFamily: 'Lexend Mega', color: 'black' }}
            >
              Geaux Bot
            </Typography>
            {isMobile && (
              <IconButton
                onClick={() => setIsHistoryOpen(true)}
                sx={{ color: 'black', fontSize: '2rem' }}
              >
                ☰
              </IconButton>
            )}
          </Box>
          {/* Chat Content Wrapper */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              // flexGrow: 1,
              // height: '100%'
              flex: '1 1 auto',
              minHeight: 0
            }}
          >
            {/* Message Area */}
            <Box
              ref={chatLogRef}
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                px: 2,
                pt: 2,
                pb: 0,
                display: 'flex',
                flexDirection: 'column',
                scrollBehavior: 'smooth'
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
                    variant: 'body1',
                    color: 'black',
                    boxShadow: '2px 2px 0px black'
                  }}
                >
                  {msg.text}
                </Typography>
              ))}
              <div ref={bottomRef} style={{ height: 0, margin: 0, padding: 0 }} />
            </Box>
            {/* Input */}
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
                inputRef={inputRef}
                fullWidth
                multiline
                minRows={2}
                maxRows={4}
                variant='standard'
                value={userMessage}
                onChange={e => setUserMessage(e.target.value)}
                placeholder='Type your message...'
                InputProps={{
                  // TODO refactor with non deprecated
                  disableUnderline: true,
                  sx: {
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    px: 2,
                    py: 1,
                    fontFamily: 'DM Sans', 
                    variant: 'body1',
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
                <SendRounded
                  sx={{ fontSize: '2rem', transform: 'translateY(-4px)' }}
                />
              </IconButton>
            </Box>
          </Box>
          
          {/* Immediate Logic for Mobile */}
          {isMobile && (
              <Box sx={{ display: 'none' }}>
                <ChatHistory
                  user={user}
                  isMobile={isMobile}
                  setIsFirstTimeUser={setIsFirstTimeUser}
                />
              </Box>
            )}

          {/* Drawer for Mobile */}
          {isMobile && (
            <Drawer
              anchor='right'
              open={isHistoryOpen}
              onClose={() => setIsHistoryOpen(false)}
              variant='temporary'
              slots={{ transition: Slide }}
              slotProps={{
                transition: { direction: 'left' },
                paper: {
                  sx: {
                    width: '85%',
                    // height: '77%',
                    // height: '100%',
                    // height: 'calc(100vh - 64px)',
                    height: `${chatHeight}px`,
                    // top: '64px',
                    top: 0,
                    right: 0,
                    // mt: '10.5vh',
                    border: '4px solid black',
                    boxShadow: '4px 4px 0px black',
                    p: 2,
                    // mr: 2.5,
                    backgroundColor: '#fff085',
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                    overflowY: 'auto',
                    position: 'absolute',
                    zIndex: 10
                  }
                }
              }}
              ModalProps={{
                container: chatContainerRef.current,
                disablePortal: true,
                keepMounted: true
              }}
            >
              <IconButton
                onClick={() => setIsHistoryOpen(false)}
                sx={{ fontFamily: 'Lexend Mega', position: 'absolute', top: 0, right: 8, color: 'black', fontSize: '2rem' }}
              >
                ☰
              </IconButton>
              <Typography
                variant='h6'
                gutterBottom
                sx={{ fontFamily: 'Lexend Mega', fontSize: '2rem' }}
              >
                Chat History
              </Typography>
              <ChatHistory user={user} isMobile={isMobile} setIsFirstTimeUser={setIsFirstTimeUser}/>
            </Drawer>
          )}
        </Box>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: '500px',
              height: '84vh',
              // mt: 'auto',
              mb: 0,
              ml: 2,
              m: 1,
              p: 0,
              backgroundColor: '#fff085',
              border: '2px solid black',
              borderRadius: 4,
              boxShadow: '4px 4px 0px black',
              px: 1.5,
              pt: 1,
              // pb: .5,
              overflowY: 'auto'
            }}
          >
            <Typography
              variant='h3'
              gutterBottom
              sx={{ fontFamily: 'Lexend Mega' }}
            >
              Chat History
            </Typography>
            <ChatHistory user={user} isMobile={isMobile} setIsFirstTimeUser={setIsFirstTimeUser}/>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FullScreenChat;
