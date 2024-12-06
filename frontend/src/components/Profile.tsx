import React, { useState, useEffect } from "react";
import { Avatar, Row, Col, Typography, Divider, Button } from "antd";
import getUsers from "../api/GetUsers";
import { getCreatedTicketsCount, getCompletedTicketsCount } from "../api/TicketCount";
import User from "../types/User";
import { List, set } from "immutable";
import { $isLoggedIn, setIsLoggedIn } from "../store/store";
import { useStore } from "@nanostores/react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const [UserList, setUserList] = useState<List<User>>(List());
  const [error, setError] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [createdTickets, setCreatedTickets] = useState<number>(0);
  const [completedTickets, setCompletedTickets] = useState<number>(0);
  const navigate = useNavigate();
  const isLoggedIn = useStore($isLoggedIn);

// fetch the users to get user info of current user
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

  // remove id from storage and send to login screen
  const handleLogout = () => {
    localStorage.removeItem("activeUID"); 
    window.location.assign("/");
    setIsLoggedIn(false); 
  };

  // get initials for avatar
  const getInitials = (user: User | null): string => {
    if (!user) return "";
    const { firstname, lastname } = user;
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

    // prompt user to login if they are not

    if (!isLoggedIn) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Button type="primary" onClick={() => navigate("/")}>
            Login
          </Button>
        </div>
      );
    }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "20px",
        textAlign: "center",
      }}
    >

      <Button
        type="primary"
        danger
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
        }}
      >
        Logout
      </Button>

      {/* Avatar and Name */}
      <Avatar
        size={120}
        style={{
          backgroundColor: "#d9d9d9",
          color: "#595959",
          fontSize: "36px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {getInitials(activeUser)}
      </Avatar>

      <Title level={3} style={{ marginBottom: "5px" }}>
        {activeUser ? `${activeUser.firstname} ${activeUser.lastname}` : "Loading..."}
      </Title>


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
