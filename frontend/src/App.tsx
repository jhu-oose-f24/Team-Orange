import React, { useState, useEffect } from "react";
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
import SearchBar from "./components/SearchBar";
import "./App.css";
import UsersDropdown from "./components/UsersDropdown.dev";
import FloatingActionButton from "./components/FloatingActionButton"; // Import the FAB component

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

  const [searchParams, setSearchParams] = useState({});
  const [refresh, setRefresh] = useState(false);

  const handleSearch = (params: any) => {
    setSearchParams(params);
  };

  useEffect(() => {
  }, [refresh]);

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
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                      <SearchBar onSearch={handleSearch} />
                    </div>
                    <div className="feed-container">
                      <Feed statusFilter="Open" searchParams={searchParams} refresh={refresh} setRefresh={setRefresh} />
                      <Feed statusFilter="InProgress" searchParams={searchParams} refresh={refresh} setRefresh={setRefresh}/>
                      <Feed statusFilter="Done" searchParams={searchParams} refresh={refresh} setRefresh={setRefresh}/>
                    </div>
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
        <FloatingActionButton /> {/* Add the FAB component */}
      </Layout>
    </Router>
  );
};

export default App;
