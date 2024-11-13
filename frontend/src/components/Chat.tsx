import React, { useState, useEffect } from 'react';
import { Input, Button, Card } from 'antd';
import getMessages from '../api/GetMessages';
import postMessage from '../api/PostMessage';
import Message from '../types/Message';

interface ChatProps {
  ticketId: string;
  ownerID: string;
  assignedID: string | null;
}

interface MessageData {
  sending_id: string;
  receiving_id: string;
  ticket_id: string;
  message: string;
}

const Chat: React.FC<ChatProps> = ({ ticketId, ownerID, assignedID }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const activeUID = localStorage.getItem("activeUID") || '';

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages(ticketId);
        setMessages(fetchedMessages);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const receiving_id = activeUID === ownerID ? assignedID as string: ownerID;

    const newMessage: MessageData = {
      sending_id: activeUID,
      receiving_id,
      ticket_id: ticketId,
      message: inputValue,
    };

    try {
      // Send the new message to the server
      const sentMessage = await postMessage(newMessage);
      setMessages([...messages, sentMessage]);
      setInputValue(""); // Clear the input field
    } catch (error) {
      console.error("Failed to send message:", error);
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
          messages.map((message) => (
            <div 
              key={message.id} 
              style={{
                display: 'flex',
                justifyContent: message.sending_id === activeUID ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: message.sending_id === activeUID ? '#0084ff' : '#e5e5ea',
                  color: message.sending_id === activeUID ? 'white' : 'black',
                }}
              >
                {message.message}
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



