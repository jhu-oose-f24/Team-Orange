interface Ticket {
    title: string;
    category: string;
    description: string;
    deadline: string;
    status: string;
    owner_id: number;
    assigneduser_id: number | null;
    payment: number | null;
}

export default Ticket;