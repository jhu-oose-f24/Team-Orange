import React, { useEffect, useState} from 'react';
import getTickets from '../api/GetTickets';
import deleteTicket from '../api/DeleteTicket';

import Ticket from './Ticket';
import { List } from 'immutable';

const BASE_URL = 'http://localhost:3000/tickets'; // change this API later
const AuthorFeed: React.FC<{ userId: number }> = ({ userId }) => {
    const [tickets, setTickets] = useState<List<{ id: number; title: string; description: string; category: string; status: string; deadline: string; owner_id: number , payment: number}>>(List());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                // const fetchedTickets = await getTickets(userId);
                const fetchedTickets = await getTickets();
                setTickets(List(fetchedTickets));
            } catch (error) {
                setError("Failed to fetch Authors's tickets. Please try again later.");
            }
        };

        fetchTickets();
    }, [tickets]);

    const handleDeleteTicket = async (ticketId: number) => {
        try {
            await deleteTicket(ticketId);
            const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
            setTickets(List(updatedTickets));
        } catch (error) {
            console.error('Failed to delete ticket:', error);
        }
    };

    return (
        <div className="author-feed">
            {error && <div className="error">{error}</div>}
            {tickets.map(ticket => (
                <div key={ticket.id}>
                    <Ticket 
                        id={ticket.id}
                        title={ticket.title} 
                        description={ticket.description} 
                        category={ticket.category}
                        status={ticket.status}
                        deadline={ticket.deadline}
                        owner_id={ticket.owner_id}
                        payment={ticket.payment}
                        onDelete={handleDeleteTicket}
                    />
                </div>
            ))}
        </div>
    );
}
export default AuthorFeed;


