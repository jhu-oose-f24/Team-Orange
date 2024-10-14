import React from 'react';
import { Card, Avatar } from 'antd';
import Feed from './Feed'; // Import the Feed component
import 'antd/dist/reset.css';

const { Meta } = Card;

const Profile: React.FC = () => {
    // Hardcoded values for right now, will eventually be replaced with dynamic data. Props can be used to pass data to the component.
    const name = "Beej Doe"; 
    const bio = "Software developer with a passion for creating amazing applications.";
    const avatarUrl = "https://i.pravatar.cc/150?img=3"; // A placeholder avatar URL

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
            <Card
                style={{ width: '100%' }}
                cover={<img alt="profile cover" src={avatarUrl} />}
            >
                <Meta
                    avatar={<Avatar size={64} src={avatarUrl} />}
                    title={name}
                    description={bio}
                />
            </Card>
            <Feed /> {/* Will eventually be a feed of your created tickets and picked up tickets */}
        </div>
    );
};

export default Profile;
