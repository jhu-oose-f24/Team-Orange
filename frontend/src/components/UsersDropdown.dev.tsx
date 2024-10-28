import React, { useState, useEffect } from "react";
import { Avatar, Button, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import getUsers from "../api/GetUsers";
import { List } from "immutable";
import User from "../types/User";

const UsersDropdown: React.FC = () => {
  const [UserList, setUserList] = useState<List<User>>(List());
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  user
    ? localStorage.setItem("activeUID", user.id)
    : localStorage.removeItem("activeUID");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUserList(List(fetchedUsers));
      } catch (error) {
        setError("Failed to fetch users. Please try again later.");
      }
    };
    fetchUsers();
  }, []);

  const items = UserList.map((u, index) => ({
    key: index.toString(),
    label: u.name,
    onClick: () => setUser(u),
  })).toArray();

  return (
    <>
      <Avatar
        style={{
          backgroundColor: user ? "#87d068" : "#f56a00",
          verticalAlign: "middle",
        }}
        size="large"
      >
        {user
          ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
          : "?"}
      </Avatar>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button
          size="small"
          style={{ margin: "0 16px", verticalAlign: "middle" }}
        >
          <Space>
            Change User (Dev)
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default UsersDropdown;
