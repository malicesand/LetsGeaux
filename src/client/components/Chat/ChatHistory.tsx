import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { user, chatHistory, message } from '../../../../types/models.ts';

interface MessageList {
  title: string,
  content: Array<message>
}
interface UserConvosList {
  title: string,
  messages: Array<MessageList>
}
interface ChatHistProps {
  user: user,
  message: message,
  chatHist: chatHistory
}

const ChatHistory: React.FC <ChatHistProps>= ({user, message, chatHist}) => {
  const [convoName, setConvoName] = useState<string>('');
  const [messages, setMessages] = useState<MessageList[]>([]);
  const [convoList, setConvoList] = useState<UserConvosList[]>([]);
  const userId = user.id;
  useEffect(() => {
    const getUserConvos = async () => {
      const response = await axios.get(`/api/chats/chat-history/${userId}`); 
      setConvoList(response.data)
    } 
  })


  return( 
    <div>Ur hISTory</div>
  );
}

export default ChatHistory;