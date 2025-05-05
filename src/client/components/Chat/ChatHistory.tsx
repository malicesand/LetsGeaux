import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Divider,
  ListItemText,
  ListItem,
  List,
  TextField,
  Button 
} from '@mui/material';
import { user, chatHistory, message } from '../../../../types/models.ts';

interface ChatMessage {
  botMessage: string;
  humanMessage: string;
}

interface ChatHistProps {
  user: user;
  isMobile: boolean;
  setIsFirstTimeUser: (val: boolean) => void;
}
interface SessionWithMessages {
  session: chatHistory;
  messages: message[];
}

const ChatHistory: React.FC<ChatHistProps> = ({ 
  user,
  isMobile,
  setIsFirstTimeUser 
}) => {
  const [sessionsWithMessages, setSessionsWithMessages] = useState<SessionWithMessages[]>([]);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editedTitle, setEditedTitle] = useState<string>('');
  const userId = user.id;
  

  //* Fetch Conversations When Page Loads *//
  const getUserSessions = async () => {
    try {
      const response = await axios.get<chatHistory[]>(
        `/api/chats/chat-history/${userId}`
      );
      const sessions = response.data;
      // console.log(`Setting isFirstTimeUser: ${sessions.length === 0}`)
      setIsFirstTimeUser(sessions.length ===  0);
      const sessionMessages: SessionWithMessages[] = [];

      for (const session of sessions) {
        // console.log(session);
        const msgRes = await axios.get<message[]>(
          `/api/chats/messages/${session.sessionId}`
        );
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
  useEffect(() => {
    getUserSessions();
    // console.log('ChatHistory mounted')
  }, []);

  //* Change Session Name *//
  //Event Handler 
  const startEditing = (sessionId: string, currentTitle: string) => {
    
    setEditingSessionId(sessionId);
    setEditedTitle(currentTitle || '');
  };
  // Request Handler
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
  };

  // TODO - user should be able to resume any session in their current history

  //* Delete Session *//
  const handleDelete = async(sessionId: string) => {
    try {
      const response = await axios.delete(`/api/chats/${sessionId}`);
      console.log('deleted session and messages');
      getUserSessions();
    } catch (error) {
      console.error('failed to delete session');      
    };
  };

  // TODO - Polish unexpanded history view
  
  // TODO - Spruce things up with an Icon?
  // TODO - Visual Indicator for Editing
  return (
    <List sx={{ p: 0 }}>
      {/* Chat History List */}
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
          {/* Session Name and Message Log */}
          <CardContent
            sx={{cursor: 'pointer'}} 
            id='session.sessionId' 
            onClick={() => setExpandedSessionId(prev =>
              prev === session.sessionId ? null : session.sessionId)
            }
          >
            {/* Session Name: Editing and Fixed State */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {/* <PiChatTextBold /> */}
              {editingSessionId === session.sessionId ? (
                <TextField
                  type="text"
                  size="medium"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveEditedName(session.sessionId);
                    }
                  }}
                  onBlur = {() => {
                    if (editedTitle.trim() && editedTitle !== session.conversationName){
                      saveEditedName(session.sessionId);
                    } else {
                      setEditingSessionId(null);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <Box>
                  <Typography variant='h4' fontWeight='bold'>
                    {session.conversationName || messages[0].userMessage}
                  </Typography>
                  <Typography variant='body2' sx={{ pt: 1 }}>
                    Last active: {new Date(session.lastActive).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Box>
            <Divider
              sx={{ border: '2px solid black', borderRadius: 8 }}
            />
            {/* Message List */}
            {expandedSessionId === session.sessionId && (
              <List component='div' disablePadding sx={{ pt: 2, pl: 2, cursor: 'pointer' }}>
                {messages.map(msg => (
                  <ListItem 
                    key={msg.id} 
                    alignItems="flex-start"
                    sx={{ 
                      pl: 0,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      mb: 2,
                      // p: 1,
                      // border: '1px solid #ddd',
                      // borderRadius: 2,
                      // backgroundColor: '#f9f9f9',
                    }}
                  >
                    {/* <ListItemText 
                      primary={`You: ${msg.userMessage}`}
                      secondary={`Gata: ${msg.botResponse}`}
                      slotProps = {{
                        primary: {variant: 'body1', color: 'gray'},
                        secondary: {variant: 'body1', color: 'black'},
                      }}
                      /> */}
                    <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                      You:
                    </Typography>
                    <Typography variant='body1' sx={{ mb: 1 }}>
                      {msg.userMessage}
                    </Typography>
                    <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                      Gata:
                    </Typography>
                    <Typography variant='body1'>
                      {msg.botResponse}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
          {/* Buttons */}
          <CardActions 
            sx={{ 
              pt: 0, 
              justifyContent: 'space-between',
              flexDirection: 'row',
              gap: 0,
              alignItems: isMobile ? 'stretch' : 'center', 
            }}>
            <Button 
              variant='contained' 
              size='small' 
              style={{maxWidth: '110px', maxHeight: '110', minWidth: '110', minHeight: '110'}}
              onClick={() =>
                startEditing(session.sessionId, session.conversationName || '') 
            }>
              Rename  
            </Button>
            <Divider/>
            <Button 
              variant='contained' 
              size='small' 
              style={{maxWidth: '110px', maxHeight: '110', minWidth: '110', minHeight: '110'}}
              onClick={() =>
              handleDelete(session.sessionId) 
            }>
              Delete 
            </Button>
          </CardActions>
        </Card>
      ))}
    </List>
  );
};

export default ChatHistory;
