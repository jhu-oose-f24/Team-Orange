import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

// FAB on feed to bring user to create ticket page

const FloatingActionButton: React.FC = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/create-ticket');
    };

    return (
        <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleClick}
            style={{
                position: 'fixed',
                bottom: '36px',
                right: '36px',
                zIndex: 1000,
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                width: '64px',
                height: '64px',
            }}
        />
    );
};
export default FloatingActionButton;