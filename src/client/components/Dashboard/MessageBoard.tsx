import React, { useState, useRef } from 'react';
import MessageList from './MessageList';
import ReplyForm from './ReplyForm';
import { user } from '../../../../types/models.ts';

interface MessageBoardProps {
  user: user;
}

export interface ChatMessage {
  text: string;
  user: boolean;
}

const MessageBoard: React.FC<MessageBoardProps> = ({ user }) => {
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const chatLogRef = useRef<HTMLDivElement>(null);

  const handleNewMessage = (newMsg: ChatMessage) => {
    setChatLog((prev) => [...prev, newMsg]);
  };

  return (
    <div style={{ flex: 3, maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Welcome {user.username}!</h2>
      <MessageList chatLog={chatLog} chatLogRef={chatLogRef} />
      <ReplyForm onSend={handleNewMessage} user={user} />
    </div>
  );
};

export default MessageBoard;
