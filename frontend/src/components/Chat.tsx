import React, { useState, useEffect } from 'react';
import { Input, Button, Card } from 'antd';
import getMessages from '../api/GetMessages';
import createMessage from '../api/CreateMessage';

interface ChatProps {
  ticketId: string;
  receiverId: string | null;
  ownerID: string;
}

type Message = {
  id: string;
  sending_id: string;
  receiving_id: string;
  ticket_id: string;
  message: string;
  create_time: string;
};

const Chat: React.FC<ChatProps> = ({ticketId, receiverId, ownerID }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);


    // Fetch messages once when component mounts
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
    }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    // create new message 
    const sendMessage = {
      sending_id: ownerID,
      receiving_id: receiverId,
      ticket_id: ticketId,
      message: inputValue
    }
    console.log(ownerID);
    console.log(inputValue);

    // send the message to the db
    try{
      const savedMessage = await createMessage(sendMessage);
      setMessages([...messages, savedMessage]); // Add the sent message to the chat
      setInputValue(''); // Clear input field
    }
    catch (err) {
      console.error('Failed to send message:', err);
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
                justifyContent: message.sending_id === ownerID ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: message.sending_id === ownerID? '#0084ff' : '#e5e5ea',
                  color: message.sending_id === ownerID ? 'white' : 'black',
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


