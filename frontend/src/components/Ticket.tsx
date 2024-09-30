import React from 'react';

interface TicketProps {
    title: string;
    description: string;
    category: string; 
    deadline: string; 
    owner_id: number;
}

const Ticket: React.FC<TicketProps> = ({ title, description, category, deadline, owner_id }) => {
    return (
        <div className="ticket">
            <h2>{title}</h2>
            <p>{description}</p>
            <p><strong>Category:</strong> {category}</p>
            <p><strong>Deadline:</strong> {new Date(deadline).toLocaleString()}</p> 
            <p><strong>Owner ID:</strong> {owner_id}</p>
        </div>
    );
};

export default Ticket;
