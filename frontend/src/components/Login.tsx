import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import getUsers from "../api/GetUsers";
import User from "../types/User";
import registerUser from "../api/registerUser";

const { Title } = Typography;

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [registerForm] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const users: User[] = await getUsers();
      const attemptedUser = users.find(
        (user) => user.username === username && user.password === password
      );

      if (attemptedUser) {
        localStorage.setItem("activeUID", attemptedUser.id);
        message.success(`Welcome, ${attemptedUser.firstname}!`);
        navigate("/feed");
      } else {
        message.error("Invalid username or password. Please try again.");
      }
    } catch (error) {
      message.error("Login failed. Please try again.");
    }
  };

  const showRegisterModal = () => {
    setIsModalVisible(true);
  };

  const handleRegister = async () => {
    try {
      const user = await registerForm.validateFields();
      await registerUser(user);
      message.success("Registration successful!");
      setIsModalVisible(false);
      registerForm.resetFields();
    }
    catch (error) {
      message.error("Failed to register new user. Please try again.");
    };
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    registerForm.resetFields();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Title level={2}>Enter Details to Use ChoreHop</Title>
      <Form layout="vertical" onFinish={handleLogin}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>

      <Button type="link" onClick={showRegisterModal}>
        Register a new account
      </Button>

      <Modal
        title="Register a New Account"
        visible={isModalVisible}
        onOk={handleRegister}
        onCancel={handleCancel}
        okText="Register"
        cancelText="Cancel"
      >
        <Form layout="vertical" form={registerForm}>
          <Form.Item
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: "Please enter your first name!" }]}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: "Please enter your last name!" }]}
          >
            <Input placeholder="Enter your last name" />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter a username!" }]}
          >
            <Input placeholder="Choose a username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter a password!" }]}
          >
            <Input.Password placeholder="Choose a password" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
          >
            <Input placeholder="Enter your email address" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
