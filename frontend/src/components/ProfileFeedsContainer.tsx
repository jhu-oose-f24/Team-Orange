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
      <div>
        <Button type="primary" onClick={toggleShowCompleted}>
          {showCompleted ? "Show All" : "Show Closed"}
        </Button>
      </div>
        {showCompleted ? (
          <div className="feed">
            <ProfileFeed
              statusFilter="Closed"
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>
        ) : (
          <div className="feed-container">
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
          </div>
        )}
    </div>
  );
};

export default ProfileFeedContainer;
