import React, { useEffect, useState } from "react";
import { List } from "immutable";
import searchTickets from "../api/SearchTicket";
import { Space, Typography, Row, Col } from "antd";
import TicketType from "../types/Ticket";
import Ticket from "./Ticket";
import getTickets from "../api/GetTickets";
import deleteTicket from "../api/DeleteTicket";
import deleteMessagesByTicket from "../api/DeleteMessagesByTicket";

// statusfilter to filter feeds 
// searchparams to handle search bar
interface FeedProps {
  statusFilter: string;
  searchParams: {
    title?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    minPayment?: string;
  },
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const Feed: React.FC<FeedProps> = ({ statusFilter, searchParams, refresh, setRefresh }) => {
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

  // fetch the tickets and filter them based on appropriate status
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (Object.keys(searchParams).length === 0) {
          const allTickets = await getTickets();
          const filteredTickets = allTickets.filter(
            (ticket: TicketType) => ticket.status === statusFilter
          );
          setTickets(List(filteredTickets));
        } else {
          handleSearch(searchParams);
        }
      } catch (error) {
        console.log(error)
        setError("Failed to fetch tickets. Please try again later.");
      }
    };

    fetchTickets();
  }, [searchParams, statusFilter, refresh]);

  // if search bar is full handle the search
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

  // delete tickets
  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await deleteMessagesByTicket(ticketId)
      await deleteTicket(ticketId);
      const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);
      setTickets(List(updatedTickets));
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  const { Title } = Typography;

  // return the feed (this is one feed only, ie one column)
  return (
    <div className="feed">
      <Title level={2} style={{ color: '#1677ff', marginBottom: '16px', textAlign: 'center' }}>
        {statusFilter} Tickets
      </Title>
      {error && <div className="error">{error}</div>}
      <Row gutter={[16, 16]}>
        {tickets.map((ticket) => (
          <Col span={24} key={ticket.id}>
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
              setRefresh={setRefresh}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Feed;
