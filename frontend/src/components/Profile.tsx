import React, { useState, useEffect } from "react";
import { Avatar, Row, Col, Typography, Divider } from "antd";
import getUsers from "../api/GetUsers";
import { getCreatedTicketsCount, getCompletedTicketsCount } from "../api/TicketCount";
import User from "../types/User";
import { List } from "immutable";

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const [UserList, setUserList] = useState<List<User>>(List());
  const [error, setError] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [createdTickets, setCreatedTickets] = useState<number>(0);
  const [completedTickets, setCompletedTickets] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUserList(List(fetchedUsers));

        const activeUID = localStorage.getItem("activeUID");
        if (activeUID) {
          const user = fetchedUsers.find((u: User) => u.id === activeUID);
          if (user) {
            setActiveUser(user);

            // Fetch ticket counts
            const [createdCount, completedCount] = await Promise.all([
              getCreatedTicketsCount(activeUID),
              getCompletedTicketsCount(activeUID),
            ]);
            setCreatedTickets(createdCount);
            setCompletedTickets(completedCount);
          }
        }
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchUsers();
  }, []);

  const bio = activeUser ? "I make cool apps" : "Loading bio...";
  const avatarUrl = activeUser
    ? "https://i.pravatar.cc/150?img=3" // A placeholder avatar URL
    : "";

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
        {activeUser ? `${activeUser.firstname} ${activeUser.lastname}` : "Loading..."}
      </Title>
      <Text type="secondary">{bio}</Text>
      {/* Profile Stats */}
      <Row justify="center" gutter={16} style={{ marginTop: "20px" }}>
        <Col>
          <div>
            <Title level={4}>{createdTickets}</Title>
            <Text>Created Tickets</Text>
          </div>
        </Col>
        <Col>
          <div>
            <Title level={4}>{completedTickets}</Title>
            <Text>Completed Tickets</Text>
          </div>
        </Col>
      </Row>
      <Divider />
    </div>
  );
};

export default Profile;
