import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Layout } from "antd";

const { Header } = Layout;

interface AppHeaderProps {
  tabs: { key: string; label: string; path: string }[];
}

const AppHeader: React.FC<AppHeaderProps> = ({ tabs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string>("");

  useEffect(() => {
    const currentTab = tabs.find((tab) => location.pathname.includes(tab.path));
    setSelectedKey(currentTab ? currentTab.key : "feed");
  }, [location, tabs]);

  const handleMenuClick = (e: { key: string }) => {
    const selectedTab = tabs.find((tab) => tab.key === e.key);
    if (selectedTab) navigate(selectedTab.path);
  };

  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: "24px",
          marginRight: "16px",
        }}
      >
        {" "}
        ChoreHop
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={tabs.map((tab) => ({
          key: tab.key,
          label: tab.label,
        }))}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  );
};

export default AppHeader;
