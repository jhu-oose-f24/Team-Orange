import React, { useState } from "react";
import { Input, Button, Typography, message } from "antd";
import loginUser from "../api/LoginUser";
import {useNavigate} from "react-router-dom";

const { Title } = Typography;

const LoginScreen: React.FC = () => {
  const [jhed, setJhed] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await loginUser(jhed, firstName, lastName);
      const { user } = data;
      localStorage.setItem("activeUID", user.id);
      setActiveUser(user.username);
      message.success(data.message);
      navigate("/feed");
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


