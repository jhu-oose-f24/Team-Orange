interface Ticket {
  title: string;
  category: string;
  description: string;
  deadline: string;
  status: string;
  owner_id: string;
  assigneduser_id: string | null;
  payment: number | null;
}

export default Ticket;
