import React from 'react';
import { Avatar, Card, Typography, Row, Col } from 'antd';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  avatar: string;
}

const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp, avatar }) => (
  <Row justify={isUser ? 'end' : 'start'} style={{ marginBottom: '16px' }}>
    {!isUser && (
      <Col>
        <Avatar src={avatar} style={{ marginRight: '12px' }}></Avatar>
      </Col>
    )}
    <Col>
    <div
        style={{
          backgroundColor: isUser ? '#1890ff' : '#f0f2f5',
          color: isUser ? 'white' : 'inherit',
          borderRadius: '8px',
          padding: '4px 8px', // Reduced padding
          maxWidth: '200px', // You can control the max width here
          display: 'inline-block',
        }}
      >
        <Typography.Text style={{ color: isUser ? 'white' : 'inherit' }}>
          {message}
        </Typography.Text>
      </div>
      <Typography.Text type="secondary" style={{ display: 'block', textAlign: isUser ? 'right' : 'left', marginTop: '4px' }}>
        {formatTimestamp(timestamp)}
      </Typography.Text>
    </Col>
    {isUser && (
      <Col>
        <Avatar src={avatar} style={{ marginLeft: '4px' }}></Avatar>
      </Col>
    )}
  </Row>
);

export default ChatMessage;