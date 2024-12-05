import React, { useState, useEffect } from 'react';
import { Input, Button, Card } from 'antd';
import getMessages from '../api/GetMessages';
import postMessage from '../api/PostMessage';
import Message from '../types/Message';
import ChatMessage from './ChatMessage';

interface ChatProps {
  ticketId: string;
  ownerID: string;
  assignedID: string | null;
  ownerName: string | null;
  assignedName: string | null;
}

interface MessageData {
  sending_id: string;
  receiving_id: string;
  ticket_id: string;
  message: string;
}

const Chat: React.FC<ChatProps> = ({ ticketId, ownerID, assignedID, ownerName, assignedName }) => {
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

  const getInitials = (name: string | null): string => {
    if (!name) {
      return "?";
    }
    const [firstName, lastName] = name.split(" ");
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
            <ChatMessage
              key={message.id}
              message={message.message}
              isUser={message.sending_id === activeUID}
              timestamp={message.create_time}
              avatar={getInitials(activeUID === ownerID ? ownerName : assignedName)}
            />
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



