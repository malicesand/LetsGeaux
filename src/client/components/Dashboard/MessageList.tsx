import React from 'react';
import { ChatMessage } from './MessageBoard';

interface MessageListProps {
  chatLog: ChatMessage[];
  chatLogRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ chatLog, chatLogRef }) => {
  return (
    <div
      className='chat-list'
      ref={chatLogRef}
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        height: '400px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {chatLog.map((msg, index) => (
        <div
          key={index}
          style={{
            textAlign: msg.user ? 'right' : 'left',
            color: msg.user ? 'blue' : 'grey',
            marginBottom: '5px'
          }}
        >
          <strong>{msg.user ? 'You:' : 'Other:'}</strong> {msg.text}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
