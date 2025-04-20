import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ChatHistory from './ChatHistory'
import { user } from '../../../../types/models.ts';

interface ChatMessage {
  text: string;
  user: boolean;
}

interface ChatProps {
  user: user;
}

const ChatBot: React.FC <ChatProps> = ({user}) => {
  const [userMessage, setUserMessage] = useState<string>('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const chatLogRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState(null); // ? Local Storage 
 
  useEffect(() => {
    // check local storage for session ID
    console.log(sessionId)
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Create new session ID
      fetch('/api/chats/new-session', { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem('sessionId', data.sessionId);
          setSessionId(data.sessionId);
        });
        // TODO have chat greet user on mount
    }


    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }

  }, [chatLog]);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    setChatLog([...chatLog, { text: userMessage, user: true }]);
    setUserMessage('');
    try {
      const response = await axios.post('/api/chats', { userMessage, userId: user.id, sessionId });
      setChatLog(prev => [...prev, { text: response.data, user: false }]);
    } catch (error: any) { // Type the error
        console.error("Error sending message:", error);
        setChatLog(prev => [...prev, {text: "Error: Could not get response.", user: false }]);
    };
  };

  return (
    <div style={{ display: 'flex', height: '100vh'}}>
      <Box
        className='Chat-Bot'
        sx={{ 
          flex: 3, 
          maxWidth: '800px', 
          mt: 5,
          margin: '0 auto', 
          padding: '60px' }}
      >
        <Typography variant='h1' >Gata Bot</Typography >
        <Typography variant='h3'>Welcome {user.username}!</Typography>
        <Container
          className='chat-list'
          ref={chatLogRef}
          sx={{
            border: '4px solid black',
            borderRadius: 8,
            padding: '10px',
            height: '400px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            mt: '20px'
          }}
        >
          {chatLog.map((msg, index) => (
            <Typography
              key={index}
              style={{
                textAlign: msg.user ? 'right' : 'left',
                color: msg.user ? 'black' : 'black',
                margin: '10px',
                padding: '5px'
              }}
            >
              <strong>{msg.user ? 'You:' : 'Gata:'}</strong> {msg.text}
            </Typography>
          ))}
        </Container>
        <form  onSubmit={handleSubmit} style={{ marginTop: '10px', }}>
          <TextField
            type='text'
            value={userMessage}
            onChange={e => setUserMessage(e.target.value)}
            placeholder='Type your message...'
            style={{ width: '70%', padding: '8px', marginRight: '10px' }}
          />
          <Button variant='contained'
            type='submit'
            size='medium'
            
            style={{
              marginTop: '36px',
              padding: '8px',
              cursor: 'pointer',
            }}
          >
            Send
          </Button>
        </form>
      </Box>
      {/**Chat History */}
      <Box style={{  width: '100%', maxWidth:'500px', borderLeft: '4px solid', overflowY: 'auto'}}>
        <ChatHistory user={user} />
      </Box>
    </div>
        
  );
};

export default ChatBot;
