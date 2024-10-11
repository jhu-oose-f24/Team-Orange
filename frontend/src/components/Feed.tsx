import React, { useEffect, useState } from 'react';
import Ticket from './Ticket';
import { List } from 'immutable';
import getTickets from '../api/GetTickets';
import createTicket from '../api/CreateTicket';

const Feed: React.FC = () => {
    const [tickets, setTickets] = useState<List<{ title: string; description: string; category: string; status: string; deadline: string; owner_id: number }>>(List());
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(''); 
    const [status, setStatus] = useState('Open');
    const [deadline, setDeadline] = useState(''); 
    const [ownerId, setOwnerId] = useState(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const fetchedTickets = await getTickets();
                console.log("Reaching this ------");
                setTickets(List(fetchedTickets));
            } catch (error) {
                setError('Failed to fetch tickets. Please try again later.');
            }
        };

        fetchTickets();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newTicket = { 
            title, 
            description, 
            category, 
            status,
            deadline, 
            owner_id: ownerId 
        };
        
        try {
            const createdTicket = await createTicket(newTicket);
            setTickets(tickets.push(createdTicket));
            setTitle('');
            setDescription('');
            setCategory('');
            setStatus('Open');
            setDeadline('');
            setOwnerId(1);
        } catch (error) {
            setError('Failed to create ticket. Please try again later.');
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
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    >required
                     <option value="Open">Open</option>
                    <option value="InProgress">InProgress</option>
                    <option value="Done">Done</option>
                    <option value="Closed">Closed</option>
                    
                    </select>
                <input 
                    type="datetime-local" 
                    value={deadline} 
                    onChange={(e) => setDeadline(e.target.value)} 
                    required 
                />
                <button type="submit">Create Ticket</button>
            </form>
            {tickets.map((ticket, index) => (
                <Ticket 
                    key={index}
                    title={ticket.title} 
                    description={ticket.description} 
                    category={ticket.category}
                    status = {ticket.status}
                    deadline={ticket.deadline}
                    owner_id={ticket.owner_id}
                />
            ))}
        </div>
    );
};

export default Feed;
