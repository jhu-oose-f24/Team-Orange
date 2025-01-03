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
import Login from "./components/Login";
import SearchBar from "./components/SearchBar";
import "./App.css";
import FloatingActionButton from "./components/FloatingActionButton";
import ProfileFeedContainer from "./components/ProfileFeedsContainer";
import { $isLoggedIn } from "./store/store";
import { useStore } from "@nanostores/react";
import LoginScreen from "./components/LoginScreen";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const tabs = [
    { key: "feed", label: "Feed", path: "/feed" },
    { key: "create-ticket", label: "Create Ticket", path: "/create-ticket" },
    { key: "profile", label: "Profile", path: "/profile" },
  ];

  const [searchParams, setSearchParams] = useState({});
  const [refresh, setRefresh] = useState(false);
  const isLoggedIn = useStore($isLoggedIn);

  const handleSearch = (params: any) => {
    setSearchParams(params);
  };

  useEffect(() => {
  }, [refresh]);

  return (
    <Router>
      <Layout>
        <Content>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route
              path="/create-ticket"
              element={
                <div>
                  <Header>
                    <AppHeader tabs={tabs} />
                  </Header>
                  <CreateTicket />
                </div>
              }
            />
            <Route
              path="/feed"
              element={
                <div>
                  <Header>
                    <AppHeader tabs={tabs} />
                  </Header>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "16px",
                      marginLeft: "48px", 
                    }}
                  >
                    <SearchBar onSearch={handleSearch} />
                  </div>
                  <div className="feed-container">
                    <Feed
                      statusFilter="Open"
                      searchParams={searchParams}
                      refresh={refresh}
                      setRefresh={setRefresh}
                    />
                    <Feed
                      statusFilter="InProgress"
                      searchParams={searchParams}
                      refresh={refresh}
                      setRefresh={setRefresh}
                    />
                    <Feed
                      statusFilter="Done"
                      searchParams={searchParams}
                      refresh={refresh}
                      setRefresh={setRefresh}
                    />
                  </div>
                  {isLoggedIn && <FloatingActionButton />}
                </div>
              }
            />
            <Route
              path="/profile"
              element={
                <div>
                  <Header>
                    <AppHeader tabs={tabs} />
                  </Header>
                  <Profile />
                  {isLoggedIn && (
                    <div>
                      <ProfileFeedContainer
                        refresh={refresh}
                        setRefresh={setRefresh}
                      />
                    </div>
                  )}
                  {isLoggedIn && <FloatingActionButton />}
                </div>
              }
            />
            <Route path="/" element={<Navigate to="/feed" replace />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ChoreHop ©{new Date().getFullYear()} Created for jhu-oose-24
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
