import React, { useState } from "react";
import { Input, Button, Typography, message } from "antd";
import loginUser from "../api/LoginUser";

const { Title } = Typography;

const LoginScreen: React.FC = () => {
  const [jhed, setJhed] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(jhed, firstName, lastName);
      message.success(data.message);
      console.log("User data:", data.user); // handle user data as needed
    } catch (error) {
      message.error("Login failed. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Title level={2}>Enter Details to Use ChoreHop</Title>
      <Input
        value={jhed}
        onChange={(e) => setJhed(e.target.value)}
        placeholder="Enter your Jhed"
        style={{ width: 200, marginBottom: 16 }}
      />
      <Input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Enter your First Name"
        style={{ width: 200, marginBottom: 16 }}
      />
      <Input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Enter your Last Name"
        style={{ width: 200, marginBottom: 16 }}
      />
      <Button type="primary" onClick={handleLogin}>
        Submit
      </Button>
    </div>
  );
};

export default LoginScreen;


