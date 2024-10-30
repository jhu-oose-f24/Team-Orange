interface TicketType {
  title: string;
  category: string;
  description: string;
  deadline: string;
  status: string;
  owner_id: string;
  assigneduser_id: number | null;
  payment: number | null;
}

export default TicketType;
