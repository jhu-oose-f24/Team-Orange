import React, { useState } from 'react';
import editTicket from '../api/EditTicket';

interface TicketProps {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    deadline: string;
    owner_id: number;
    payment: number;
    onDelete: (ticketId: number) => void;
}

const Ticket: React.FC<TicketProps> = ({ id, title, description, category, status, deadline, owner_id, payment, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(title);
    const [editDescription, setEditDescription] = useState(description);
    const [editCategory, setEditCategory] = useState(category);
    const [editStatus, setEditStatus] = useState(status);
    const [editDeadline, setEditDeadline] = useState(deadline.slice(0,-1));
    const [editPayment, setEditPayment] = useState(payment);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const updatedTicket = {
            title: editTitle,
            description: editDescription,
            category: editCategory,
            deadline: editDeadline,
            payment: editPayment,
        };

        try {
            await editTicket(id, updatedTicket);
            setIsEditing(false); 
        } catch (error) {
            console.error('Failed to update ticket:', error);
        }
    };

    const handleDeleteClick = () => {
        setIsConfirmingDelete(true);
    };

    const handleConfirmDelete = () => {
        onDelete(id);
        setIsConfirmingDelete(false);
    };

    const handleCancelDelete = () => {
        setIsConfirmingDelete(false);
    };
    
    return (
        <div className="ticket">
            <h2>{title}</h2>
            <p>{description}</p>
            <p><strong>Category:</strong> {category}</p>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Owner ID:</strong> {owner_id}</p>
            <p><strong>Payment: </strong> {`$${payment}`}</p>
            <p><strong>Deadline:</strong> {new Date(deadline).toLocaleString()}</p>

            <div className="button-group" >
                <button onClick={() => setIsEditing(true)}>Edit Ticket</button>

                <button onClick={handleDeleteClick}>Delete Ticket</button>
            </div>

            {isConfirmingDelete && (
                <div className="modal">
                    <p>Are you sure you want to delete this ticket?</p>
                    <button onClick={handleConfirmDelete}>Yes</button>
                    <button onClick={handleCancelDelete}>Cancel</button>
                </div>
            )}

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
                         <select
                            value={status}
                            onChange={(e) => setEditStatus(e.target.value)}
                            >required
                            <option value="Open">Open</option>
                            <option value="InProgress">InProgress</option>
                            <option value="Done">Done</option>
                            <option value="Closed">Closed</option>
                            
                            </select>
                        <input
                            type="text"
                            placeholder="Payment"
                            value={editPayment}
                            onChange={(e) => setEditPayment(Number(e.target.value))}
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
