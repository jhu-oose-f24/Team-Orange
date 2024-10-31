import React, { useEffect, useState } from "react";
import { List } from "immutable";
import searchTickets from "../api/SearchTicket";
import { Space } from "antd";
import TicketType from "../types/Ticket";
import Ticket from "./Ticket";
import getTickets from "../api/GetTickets";
import deleteTicket from "../api/DeleteTicket";

interface FeedProps {
  statusFilter: string;
  searchParams: {
    title?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    minPayment?: string;
  };
}

const Feed: React.FC<FeedProps> = ({ statusFilter, searchParams }) => {
  const [tickets, setTickets] = useState<
    List<{
      id: string;
      title: string;
      description: string;
      category: string;
      deadline: string;
      owner_id: string;
      assigneduser_id: string | null;
      payment: number;
      status: string;
    }>
  >(List());

  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (Object.keys(searchParams).length === 0) {
          const allTickets = await getTickets();
          const filteredTickets = allTickets.filter(
            (ticket: TicketType) => ticket.status.toLowerCase() === statusFilter.toLowerCase()
          );
          setTickets(List(filteredTickets));
        } else {
          handleSearch(searchParams);
        }
      } catch (error) {
        setError("Failed to fetch tickets. Please try again later.");
      }
    };

    fetchTickets();
  }, [searchParams, statusFilter]);


  useEffect(() => {
    if (Object.keys(searchParams).length > 0) {
      handleSearch(searchParams);
    }
  }, [searchParams]);

  const handleSearch = async (params: any) => {
    try {
      const fetchedTickets = await searchTickets(params);
      const feedFilteredTickets = fetchedTickets.filter(
        (ticket: { status: string }) =>
          ticket.status.toLowerCase() === statusFilter.toLowerCase()
      );
      setTickets(List(feedFilteredTickets));
    } catch (error) {
      setError("Failed to search tickets. Please try again later.");
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await deleteTicket(ticketId);
      const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);
      setTickets(List(updatedTickets));
      setRefetch(!refetch);
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  return (
    <div className="feed">
      <h2 style={{ fontSize: "24px", color: "#61dafb" }}>
        {statusFilter} Tickets
      </h2>
      {error && <div className="error">{error}</div>}
      {tickets.map((ticket) => (
        <Space direction="vertical" size={16} key={ticket.id}>
          <Ticket
            id={ticket.id}
            title={ticket.title}
            description={ticket.description}
            category={ticket.category}
            status={ticket.status}
            deadline={ticket.deadline}
            owner_id={ticket.owner_id}
            assigneduser_id={ticket.assigneduser_id}
            payment={ticket.payment}
            onDelete={handleDeleteTicket}
            onUpdate={() => setRefetch(!refetch)}
          />
        </Space>
      ))}
    </div>
  );
};

export default Feed;
