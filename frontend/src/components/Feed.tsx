import React from 'react';
import Ticket from './Ticket.tsx';
import { List } from 'immutable';

interface FeedProps {
    tickets: List<{
        title: string;
        description: string;
    }>;
}

const Feed: React.FC<FeedProps> = ({ tickets }) => {
    return (
        <div className="feed">
            {tickets.map((ticket, index) => (
                <Ticket 
                    key={index}
                    title={ticket.title} 
                    description={ticket.description}
                />
            ))}
        </div>
    );
};

export default Feed;
