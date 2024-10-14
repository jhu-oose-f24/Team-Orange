import React, { useEffect, useState } from 'react';
import Ticket from './Ticket';
import { List } from 'immutable';
import getTickets from '../api/GetTickets';
import createTicket from '../api/CreateTicket';
import deleteTicket from '../api/DeleteTicket';

const Feed: React.FC = () => {
    const [tickets, setTickets] = useState<List<{
        id: number;
        title: string;
        description: string;
        category: string;
        deadline: string;
        owner_id: number;
        payment: number
    }>>(List());
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(''); 
    const [deadline, setDeadline] = useState(''); 
    const [ownerId, setOwnerId] = useState(1);
    const [payment, setPayment] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const fetchedTickets = await getTickets();
                setTickets(List(fetchedTickets));
            } catch (error) {
                setError('Failed to fetch tickets. Please try again later.');
            }
        };

        fetchTickets();
    }, [tickets]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newTicket = { 
            title, 
            description, 
            category, 
            deadline,
            owner_id: ownerId, 
            payment: Number(payment)
        };
        
        try {
            const createdTicket = await createTicket(newTicket);
            setTickets(tickets.push(createdTicket));
            setTitle('');
            setDescription('');
            setCategory('');
            setDeadline('');
            setOwnerId(1);
            setPayment('');
        } catch (error) {
            setError('Failed to create ticket. Please try again later.');
        }
    };

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
        <div className="feed">
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Category" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Payment"
                    value={payment} 
                    onChange={(e) => setPayment(e.target.value)} 
                    required 
                />
                <input 
                    type="datetime-local" 
                    value={deadline} 
                    onChange={(e) => setDeadline(e.target.value)} 
                    required 
                />
                <button type="submit">Create Ticket</button>
            </form>

            {tickets.map(ticket => (
                <div key={ticket.id}>
                    <Ticket 
                    id={ticket.id}
                    title={ticket.title} 
                    description={ticket.description} 
                    category={ticket.category}
                    deadline={ticket.deadline}
                    owner_id={ticket.owner_id}
                    payment={ticket.payment}
                    onDelete={handleDeleteTicket}
                    />
                </div>
            ))}
        </div>
    );
};

export default Feed;
