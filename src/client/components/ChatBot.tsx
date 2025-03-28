import React, { useState, useEffect, useRef } from 'react';


import Prompt from '../types/prompt.ts';




interface ChatMessage {
  text: string;
  user: boolean;
}


export const sendPrompt = async (prompt: Prompt) => {
  // ...
};



const ChatBot: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const chatLogRef = useRef<HTMLDivElement>(null);

  const handleSendPrompt = (promptText: string) => {
    const prompt: Prompt = { query: promptText };
    sendPrompt(prompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatLog([...chatLog, { text: message, user: true }]);
    setMessage('');

    // try response.data
  };

  
  return (
    <div
      className='Chat-Bot'
      style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}
    >
      <h1>Gata Bot</h1>
      <div
        className='chat-list'
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '400px',
          overflowY: 'scroll'
        }}
        ref={chatLogRef}
      >
        {chatLog.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.user ? 'right' : 'left',
              marginBottom: '5px'
            }}
          >
            <strong>{msg.user ? 'You:' : 'Bot:'}</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <input
          type='text'
          value={message}
          onChange={e => setMessage(e.target.value)}
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
    </div>

        
  );
};

export default ChatBot;
