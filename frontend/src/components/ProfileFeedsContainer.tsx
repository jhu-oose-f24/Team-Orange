import React, { useState } from "react";
import ProfileFeed from "./ProfileFeed";
import { Button } from "antd";

interface ProfileFeedContainerProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileFeedContainer: React.FC<ProfileFeedContainerProps> = ({
  refresh,
  setRefresh,
}) => {
  const [showCompleted, setShowCompleted] = useState(false);

  const toggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  return (
    <div>
      <div
        style={{
          justifyContent: "center",
          marginBottom: "16px",
          width: "100%",
        }}
      >
        <Button type="primary" onClick={toggleShowCompleted}>
          {showCompleted ? "Show All" : "Show Closed"}
        </Button>
      </div>
      <div className="feed-container">
        {showCompleted ? (
          <ProfileFeed
            statusFilter="Closed"
            refresh={refresh}
            setRefresh={setRefresh}
          />
        ) : (
          <>
            <ProfileFeed
              statusFilter="My Created Tickets"
              refresh={refresh}
              setRefresh={setRefresh}
            />
            <ProfileFeed
              statusFilter="My Tasks"
              refresh={refresh}
              setRefresh={setRefresh}
            />
            <ProfileFeed
              statusFilter="Awaiting Payment"
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileFeedContainer;
