import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Layout, theme } from "antd";

import Feed from "./components/Feed";
import CreateTicket from "./components/CreateTicket";
import Profile from "./components/Profile";
import AppHeader from "./components/AppHeader";
import Login from "./components/Login"; // Import the Login component
import "./App.css";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const tabs = [
    { key: "feed", label: "Feed", path: "/feed" },
    { key: "create-ticket", label: "Create Ticket", path: "/create-ticket" },
    { key: "profile", label: "Profile", path: "/profile" },
  ];

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Layout>
        {isAuthenticated && <AppHeader tabs={tabs} />}
        <Content style={{ padding: "0 48px" }}>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              {!isAuthenticated ? (
                // If not authenticated, show the login page and set authentication on success
                <Route path="/" element={<Login onLogin={handleLogin} />} />
              ) : (
                <>
                  <Route path="/create-ticket" element={<CreateTicket />} />
                  <Route
                    path="/feed"
                    element={
                      <div className="feed-container">
                        <Feed statusFilter="Open" />
                        <Feed statusFilter="InProgress" />
                        <Feed statusFilter="Done" />
                      </div>
                    }
                  />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/" element={<Navigate to="/feed" replace />} />
                </>
              )}
              {/* Redirect to login if an unknown route is accessed */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ChoreHop ©{new Date().getFullYear()} Created for jhu-oose-24
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;

