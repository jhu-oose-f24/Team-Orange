// Welcome.tsx
import React from "react";
import { Button, Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Content } = Layout;

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    window.location.href = "https://chorehop-cc7c0bf7a12c.herokuapp.com/jhu/login";
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5", // Light background for the overlay
      }}
    >
      <Content
        style={{
          textAlign: "center",
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
          height: "50vh", // Half of the screen height
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Title level={2} style={{ marginBottom: "16px" }}>
          Welcome to ChoreHop!
        </Title>
        <Button type="primary" size="large" onClick={handleLoginClick}>
          Login with JHU Credentials
        </Button>
      </Content>
    </Layout>
  );
};

export default Welcome;
