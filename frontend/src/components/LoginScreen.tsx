import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";
import getUsers from "../api/GetUsers";
import { setIsLoggedIn } from "../store/store";
import User from "../types/User";

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSSOLogin = () => {
    // Redirect the user to the SSO login link
    window.location.href = "https://chorehop-cc7c0bf7a12c.herokuapp.com/jhu/login";
  };

  useEffect(() => {
    const handleLoginFromSSO = async (email: string) => {
      try {
        const users: User[] = await getUsers();
        const attemptedUser = users.find((user) => user.email === email);

        if (attemptedUser) {
          localStorage.setItem("activeUID", attemptedUser.id);
          message.success(`Welcome, ${attemptedUser.firstname}!`);
          setIsLoggedIn(true);
          navigate("/feed");
        } else {
          message.error("Unable to log in. Please try again.");
        }
      } catch (error) {
        message.error("Login failed. Please try again.");
      }
    };

    // Extract query parameters from the URL
    const params = new URLSearchParams(location.search);
    const email = params.get("email");

    if (email) {
      localStorage.setItem("activeUserEmail", email); // Store email in localStorage
      handleLoginFromSSO(email); // Trigger login with the extracted email
    }
  }, [location, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "24px", color: "#333" }}>
        Welcome to ChoreHop
      </h1>
      <button
        onClick={handleSSOLogin}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Login with JHU Account
      </button>
    </div>
  );
};

export default LoginScreen;


