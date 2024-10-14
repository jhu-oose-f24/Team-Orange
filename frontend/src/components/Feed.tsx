import React, { useEffect, useState } from "react";
import { List } from "immutable";
import { Button, Card, Col, Form, Input, Row, Space } from "antd";
import searchTickets from '../api/SearchTicket';
import SearchBar from './SearchBar';

import Ticket from "./Ticket";
import getTickets from "../api/GetTickets";

import deleteTicket from "../api/DeleteTicket";


const Feed: React.FC = () => {
  const [tickets, setTickets] = useState<
    List<{
      id: number;
      title: string;
      description: string;
      category: string;
      deadline: string;
      owner_id: number;
      payment: number;
    }>
  >(List());

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const fetchedTickets = await getTickets();
        setTickets(List(fetchedTickets));
      } catch (error) {
        setError("Failed to fetch tickets. Please try again later.");
      }
    };

    fetchTickets();
  }, []);

  const handleDeleteTicket = async (ticketId: number) => {
    try {
      await deleteTicket(ticketId);
      const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);
      setTickets(List(updatedTickets));
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
      setTickets(List(fetchedTickets));
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
            deadline={ticket.deadline}
            owner_id={ticket.owner_id}
            payment={ticket.payment}
            onDelete={handleDeleteTicket}
          />
        </Space>
      ))}
    </div>
  );
};

export default Feed;

