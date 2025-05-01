import React, { useState, useEffect, MouseEvent } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';  
import { Typography, Box, Card, CardContent, CardActions, Divider } from '@mui/material';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack'
import MailIcon from '@mui/icons-material/MailOutlineOutlined';//! find a more fun icon

import { user, chatHistory, message } from '../../../../types/models.ts';
// import { response } from 'express';

interface ChatMessage {
  botMessage: string;
  humanMessage: string;
}

interface ChatHistProps {
  user: user;
  isMobile: boolean;
}
interface SessionWithMessages {
  session: chatHistory;
  messages: message[];
}

const ChatHistory: React.FC<ChatHistProps> = ({ user, isMobile }) => {
  // const [messages, setMessages] = useState<message[][]>([]); // if storing messages per session
  const [sessionsWithMessages, setSessionsWithMessages] = useState<SessionWithMessages[]>([]);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editedTitle, setEditedTitle] = useState<string>('');
  const userId = user.id;

  //* Fetch Conversations *//
  const getUserSessions = async () => {
    try {
      const response = await axios.get<chatHistory[]>(
        `/api/chats/chat-history/${userId}`
      );
      const sessions = response.data;
      // console.log(sessions)
      const sessionMessages: SessionWithMessages[] = [];

      for (const session of sessions) {
        // console.log(session);
        const msgRes = await axios.get<message[]>(
          `/api/chats/messages/${session.sessionId}`
        );
        // console.log(msgRes);
        if (msgRes.data.length >= 1) {
          sessionMessages.push({
            session: session,
            messages: msgRes.data
          });
        }
      }
      setSessionsWithMessages(sessionMessages);
    } catch (error) {
      console.error('failed to generate user convos', error);
    }
  };
  //* When Page Loads *//
  useEffect(() => {
    getUserSessions();
  }, []);

  //* Change Name *//
  const startEditing = (sessionId: string, currentTitle: string) => {
    
    setEditingSessionId(sessionId);
    setEditedTitle(currentTitle || '');
  };
  // * Save New Name * //
  const saveEditedName = async (sessionId: string) => {
    try {
      
      const response = await axios.patch(`/api/chats/chat-history/${sessionId}`, {
        conversationName: editedTitle

      });
      setEditingSessionId(null);
      getUserSessions();
    } catch (error) {
      console.error('Failed to change name on client', error);
    }
  }
   // * Delete Session * //
  const handleDelete = async(sessionId: string) => {
    // console.log(sessionId)
    try {
      const response = await axios.delete(`/api/chats/${sessionId}`);
      console.log('deleted session and messages');
      getUserSessions();
      
    } catch (error) {
      console.error('failed to delete session')
      
    }

  }

  return (
    <List sx={{ p: 0 }}>
      {sessionsWithMessages.map(({ session, messages }) => (
        <Card 
        key={session.sessionId}
        variant="outlined"
        sx={{
          mb: 2,
          p: 2,
          px: isMobile ? 1 : 2,
          py: isMobile ? 1 : 2,
          backgroundColor: '#fff085',
          boxShadow: '2px 2px 0px black',
          border: '2px solid black',
          borderRadius: isMobile ? '12px' : '16px',
        }}
      >
          <CardContent sx={{cursor: 'pointer'}} id='session.sessionId' onClick={() =>
            setExpandedSessionId(prev =>
              prev === session.sessionId ? null : session.sessionId)
          }>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <MailIcon sx={{ mr: 1 }} />
            {editingSessionId === session.sessionId ? (
              <TextField
                type="text"
                size="small"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveEditedName(session.sessionId);
                  }
                }}
                autoFocus
              />
            ) : (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {session.conversationName || 'Untitled Conversation'}
                </Typography>
                <Typography variant="body2">
                  Last active: {new Date(session.lastActive).toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>
            

          {expandedSessionId === session.sessionId && (
            <List component='div' disablePadding sx={{ pl: 4, cursor: 'pointer' }}>
              {messages.map(msg => (
                <ListItem key={msg.id} sx={{ pl: 0 }}>
                  <ListItemText 
                    primary={`You: ${msg.userMessage}`}
                    secondary={`Gata: ${msg.botResponse}`}
                    slotProps = {{
                      primary: {variant: 'body2',},
                      secondary: {variant: 'body2',},
                    }}
                    />
                </ListItem>
              ))}
            </List>
          )}
          </CardContent>
          <CardActions 
            sx={{ 
              pt: 0, 
              justifyContent: 'space-between',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 1,
              alignItems: isMobile ? 'stretch' : 'center', 
            }}>
            <Button variant='contained' onClick={() =>
              startEditing(session.sessionId, session.conversationName || '')
            }>
              Change Name 
            </Button>
            <Divider/>
            <Button variant='contained' onClick={() =>
              handleDelete(session.sessionId)
            }>
              Delete Session 
            </Button>
          </CardActions>
        </Card>
      ))}
    </List>
  );
};

export default ChatHistory;
