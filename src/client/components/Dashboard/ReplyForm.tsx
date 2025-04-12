import React, { useState } from 'react';
import { ChatMessage } from './MessageBoard';
import { user } from '../../../../types/models.ts';

interface ReplyFormProps {
  user: user;
  onSend: (message: ChatMessage) => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ onSend }) => {
  const [userMessage, setUserMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    onSend({ text: userMessage, user: true });
    setUserMessage('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
      <input
        type='text'
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder='Type your message...'
        style={{ width: '70%', padding: '8px', marginRight: '10px' }}
      />
      <button
        type='submit'
        style={{
          padding: '8px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Send
      </button>
    </form>
  );
};

export default ReplyForm;
