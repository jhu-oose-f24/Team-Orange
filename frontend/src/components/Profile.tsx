import React, { useState, useEffect } from 'react';
import { Card, Avatar, Row, Col, Typography, Divider } from 'antd';
import ProfileFeed from './ProfileFeed';
import Feed from './Feed'; 
import { List } from 'immutable';
import getUsers from '../api/GetUsers';
import User from '../types/User';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const name = "Beej Doe";
  const bio = "I make cool apps";
  const avatarUrl = "https://i.pravatar.cc/150?img=3"; // A placeholder avatar URL

  // Profile stats (hardcoded for now, can be dynamic)
  const created_tickets = 4;
  const completed_tickets = 10;

  const [UserList, setUserList] = useState<List<User>>(List());
  const [error, setError] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUserList(List(fetchedUsers));

        const activeUID = localStorage.getItem("activeUID");
        if (activeUID) {
          const activeUser = fetchedUsers.find((user: User) => user.id === activeUID);
          if (activeUser) setActiveUser(activeUser.name);
        }

      } catch (error) {
        setError("Failed to fetch users. Please try again later.");
      }
    };
    fetchUsers();
  }, []);
  
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {/* Avatar and Name */}
      <Avatar size={120} src={avatarUrl} style={{ marginBottom: "10px" }} />
      <Title level={3} style={{ marginBottom: "5px" }}>
        {name}
      </Title>
      <Text type="secondary">{bio}</Text>
      {/* Profile Stats */}
      <Row justify="center" gutter={16} style={{ marginTop: "20px" }}>
        <Col>
          <div>
            <Title level={4}>{created_tickets}</Title>
            <Text>Created Tickets</Text>
          </div>
        </Col>
        <Col>
          <div>
            <Title level={4}>{completed_tickets}</Title>
            <Text>Completed Tickets</Text>
          </div>
        </Col>
      </Row>
      <Divider />
      {/* Post Grid */}
      <ProfileFeed user_id='011ff2c1-1ade-4c92-a649-9725f85aec00'/>{" "}
      {/* This would represent your user's posts displayed in a grid */}
    </div>
  );
};

export default Profile;
