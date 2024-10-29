import React, { useState, useEffect } from "react";
import {Button, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import getUsers from "../api/GetUsers";
import { List } from "immutable";
import User from "../types/User";

const UsersDropdown: React.FC = () => {
  const [UserList, setUserList] = useState<List<User>>(List());
  const [error, setError] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUserList(List(fetchedUsers));

        const activeUID = localStorage.getItem("activeUID");
        if (activeUID) {
          const activeUser = fetchedUsers.find((user: User) => user.id === activeUID);
          if (activeUser) setActiveUser(activeUser.name);
        }

      } catch (error) {
        setError("Failed to fetch users. Please try again later.");
      }
    };
    fetchUsers();
  }, []);

  const items = UserList.map((user, index) => ({
    key: index.toString(),
    label: user.name,
    onClick: () => {
        localStorage.setItem("activeUID", user.id);
        setActiveUser(user.name);
      },
  })).toArray();

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button
          size="small"
          style={{ margin: "0 16px", verticalAlign: "middle" }}
        >
          <Space>
            Change User
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {activeUser && <p style={{ color: "blue" }}>Logged in as {activeUser} with UUID {localStorage.getItem('activeUID')}</p>}

    </>
  );
};

export default UsersDropdown;
