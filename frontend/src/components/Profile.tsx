import React from 'react';
import { Card, Avatar, Row, Col, Typography, Divider } from 'antd';
import Feed from './Feed'; // Import the Feed component

const { Title, Text } = Typography;

const Profile: React.FC = () => {
    const name = "Beej Doe"; 
    const bio = "I make cool apps";
    const avatarUrl = "https://i.pravatar.cc/150?img=3"; // A placeholder avatar URL

    // Profile stats (hardcoded for now, can be dynamic)
    const created_tickets = 4;
    const completed_tickets = 10;

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            {/* Avatar and Name */}
            <Avatar size={120} src={avatarUrl} style={{ marginBottom: '10px' }} />
            <Title level={3} style={{ marginBottom: '5px' }}>{name}</Title>
            <Text type="secondary">{bio}</Text>

            {/* Profile Stats */}
            <Row justify="center" gutter={16} style={{ marginTop: '20px' }}>
                <Col>
                    <div>
                        <Title level={4}>{created_tickets}</Title>
                        <Text>Created Tickets</Text>
                    </div>
                </Col>
                <Col>
                    <div>
                        <Title level={4}>{completed_tickets}</Title>
                        <Text>Completed Tickets</Text>
                    </div>
                </Col>
            </Row>

            <Divider />

            {/* Post Grid */}
            <Feed /> {/* This would represent your user's posts displayed in a grid */}
        </div>
    );
};

export default Profile;
