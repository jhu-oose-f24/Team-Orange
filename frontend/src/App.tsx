import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Layout, theme } from "antd";

import Feed from "./components/Feed";
import CreateTicket from "./components/CreateTicket";
import Profile from "./components/Profile";
import AppHeader from "./components/AppHeader";
import "./App.css";
import UsersDropdown from "./components/UsersDropdown.dev";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const tabs = [
    { key: "feed", label: "Feed", path: "/feed" },
    { key: "create-ticket", label: "Create Ticket", path: "/create-ticket" },
    { key: "profile", label: "Profile", path: "/profile" },
    { key: "dev-user", label: "DevUser", path: "/dev-user" },
  ];

  // statusFilter very case sensitive. Also not addressing Closed option

  return (
    <Router>
      <Layout>
        <AppHeader tabs={tabs} />
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
              <Route path="/dev-user" element={<UsersDropdown />} />
              <Route path="/" element={<Navigate to="/feed" replace />} />
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
