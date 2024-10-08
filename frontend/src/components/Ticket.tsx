import React, { useState } from 'react';
import editTicket from '../api/EditTicket.ts';

interface TicketProps {
    id: number;
    title: string;
    description: string;
    category: string;
    deadline: string;
    owner_id: number;
    onEdit: (updatedTicket: {
        id: number;
        title: string;
        description: string;
        category: string;
        deadline: string;
        owner_id: number;
    }) => void;
}


const Ticket: React.FC<TicketProps> = ({ id, title, description, category, deadline, owner_id }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(title);
    const [editDescription, setEditDescription] = useState(description);
    const [editCategory, setEditCategory] = useState(category);
    const [editDeadline, setEditDeadline] = useState(deadline.slice(0,-1));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const updatedTicket = {
            title: editTitle,
            description: editDescription,
            category: editCategory,
            deadline: editDeadline,
        };

        try {
            await editTicket(id, updatedTicket);
            setIsEditing(false); 
        } catch (error) {
            console.error('Failed to update ticket:', error);
        }
    };

    return (
        <div className="ticket">
            <h2>{title}</h2>
            <p>{description}</p>
            <p><strong>Category:</strong> {category}</p>
            <p><strong>Deadline:</strong> {new Date(deadline).toLocaleString()}</p>
            <p><strong>Owner ID:</strong> {owner_id}</p>
            <button onClick={() => setIsEditing(true)}>Edit Ticket</button>

            {isEditing && (
                <div className="modal">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            required
                        />
                        <input
                            type="datetime-local"
                            value={editDeadline}
                            onChange={(e) => setEditDeadline(e.target.value)}
                            required
                        />
                        <button type="submit">Update Ticket</button>
                    </form>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Ticket;
