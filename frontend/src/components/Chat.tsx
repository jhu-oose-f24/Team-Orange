import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';

const Chat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ text: string; from: 'user' | 'other' }[]>([]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [...prevMessages, { text: inputValue, from: 'user' }]);
      setInputValue('');

      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { text: 'Message Received', from: 'other' }]);
      }, 500);
    }
  };

  return (
    <Card style={{ width: '100%', maxWidth: '800px', height: '100%', padding: '1rem', margin: '0 auto' }}>
      <div
        style={{
          maxHeight: 500,
          overflowY: 'auto',
          marginBottom: '1rem',
          padding: '0.5rem',
          borderRadius: '8px',
        }}
      >
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No messages yet</p>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                justifyContent: message.from === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: message.from === 'user' ? '#0084ff' : '#e5e5ea',
                  color: message.from === 'user' ? 'white' : 'black',
                }}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
      </div>
      <Input.Group compact style={{ display: 'flex' }}>
        <Input
          style={{ flex: 1 }}
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSendMessage}
        />
        <Button type="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Input.Group>
    </Card>
  );
};

export default Chat;

