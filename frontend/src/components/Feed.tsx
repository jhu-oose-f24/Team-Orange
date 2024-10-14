import React, { useEffect, useState } from "react";
import { List } from "immutable";
import searchTickets from "../api/SearchTicket";
import SearchBar from './SearchBar';
import { Space } from "antd";

import Ticket from "./Ticket";
import getTickets from "../api/GetTickets";

import deleteTicket from "../api/DeleteTicket";

interface FeedProps {
    statusFilter: string; 
  }

const Feed: React.FC<FeedProps> = ({statusFilter}) => {
  const [tickets, setTickets] = useState<
    List<{
      id: number;
      title: string;
      description: string;
      category: string;
      deadline: string;
      owner_id: number;
      payment: number;
      status: string;
    }>
  >(List());

  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(false); // Refetch trigger

  useEffect(() => {
    const fetchTickets = async () => {
        try {
            const fetchedTickets = await getTickets();
            // Filter tickets based on statusFilter
            const filteredTickets = fetchedTickets.filter(
                (ticket: { status: string; }) => ticket.status.toLowerCase() === statusFilter.toLowerCase()
              );
            setTickets(List(filteredTickets));
          }  catch (error) {
        setError("Failed to fetch tickets. Please try again later.");
      }
    };

    fetchTickets();
  }, [refetch, statusFilter]);

  const handleDeleteTicket = async (ticketId: number) => {
    try {
      await deleteTicket(ticketId);
      const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);
      setTickets(List(updatedTickets));
      setRefetch(!refetch);
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  const handleSearch = async (searchParams: { title?: string; startDate?: string; endDate?: string }) => {
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined)
    );

    try {
      const fetchedTickets = await searchTickets(filteredParams);
      const feedFilteredTickets = fetchedTickets.filter(
        (ticket: { status: string }) => ticket.status.toLowerCase() === statusFilter.toLowerCase()
      );
      setTickets(List(feedFilteredTickets));
    } catch (error) {
      setError('Failed to search tickets. Please try again later.');
    }
  };

  return (
    <div className="feed">
      {error && <div className="error">{error}</div>}
      <SearchBar onSearch={handleSearch} />
      {tickets.map((ticket) => (
        <Space direction="vertical" size={16}>
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
            onUpdate={() => setRefetch(!refetch)}
          />
        </Space>
      ))}
    </div>
  );
};

export default Feed;

