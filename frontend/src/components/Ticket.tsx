import React from 'react';

interface TicketProps {
    title: string;
    description: string;
}

const Ticket: React.FC<TicketProps> = ({ title, description }) => {
    return (
        <div className="ticket">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
};

export default Ticket;
