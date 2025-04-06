import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import MailIcon from '@mui/icons-material/MailOutlineOutlined';

import { user, chatHistory, message } from '../../../../types/models.ts';
// import { response } from 'express';

interface ChatMessage {
  botMessage: string;
  humanMessage: string;
}
// type Sessions: {

// }

// interface UserSession {

// }
// interface UserSessions {
//   sessions: Array<chatHistory>
// }
interface ChatHistProps {
  user: user;
  // message: message;
  // chatHistory: chatHistory;
  // Sessions:
}
interface SessionWithMessages {
  session: chatHistory;
  messages: message[];
}

const ChatHistory: React.FC<ChatHistProps> = ({ user }) => {
  // const [messages, setMessages] = useState<message[][]>([]); // if storing messages per session
  const [sessionsWithMessages, setSessionsWithMessages] = useState<
    SessionWithMessages[]
  >([]);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(
    null
  );

  const userId = user.id;

  const getUserSessions = async () => {
    try {
      const response = await axios.get<chatHistory[]>(
        `/api/chats/chat-history/${userId}`
      );
      const sessions = response.data;
      // console.log(sessions)
      const sessionMessages: SessionWithMessages[] = [];

      for (const session of sessions) {
        console.log(session);
        const msgRes = await axios.get<message[]>(
          `/api/chats/messages/${session.sessionId}`
        );
        // console.log(msgRes);
        sessionMessages.push({
          session: session,
          messages: msgRes.data
        });
      }
      setSessionsWithMessages(sessionMessages);
    } catch (error) {
      console.error('failed to generate user convos', error);
    }
  };

  useEffect(() => {
    getUserSessions();
  }, []);

  return (
    <List>
      {sessionsWithMessages.map(({ session, messages }) => (
        <React.Fragment key={session.sessionId}>
          <ListItem onClick={() =>
            setExpandedSessionId(prev =>
              prev === session.sessionId ? null : session.sessionId)}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText
            primary={session.conversationName || 'Untitled Conversation'}
            secondary={`Last active: ${new Date(session.lastActive).toLocaleString()}`}
          />
          </ListItem>
          {expandedSessionId === session.sessionId && (
            <List component='div' disablePadding sx={{ pl: 4 }}>
              {messages.map(msg => (
                <ListItem key={msg.id}>
                  <ListItemText
                    primary={`You: ${msg.userMessage}`}
                    secondary={`Bot: ${msg.botResponse}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default ChatHistory;
