import React, { useEffect, useState } from "react";
import { List } from "immutable";
import {Typography, Row, Col } from "antd";
import TicketType from "../types/Ticket";
import Ticket from "./Ticket";
import getTickets from "../api/GetTickets";
import deleteTicket from "../api/DeleteTicket";
import deleteMessagesByTicket from "../api/DeleteMessagesByTicket";

// status filter used to filter the feeds
interface ProfileFeedProps {
  statusFilter: string;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileFeed: React.FC<ProfileFeedProps> = ({
  statusFilter,
  refresh,
  setRefresh,
}) => {
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
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // handle filters here
        const allTickets = await getTickets();

        // show all users created tickets
        if (statusFilter === "My Created Tickets") {
          const filteredTickets = allTickets.filter(
            (ticket: TicketType) =>
              ticket.owner_id === localStorage.getItem("activeUID"),
          );
          setTickets(List(filteredTickets));
        } 
        // show users picked up tickets
        else if (statusFilter === "My Tasks") {
          const filteredTickets = allTickets.filter(
            (ticket: TicketType) =>
              ticket.assigneduser_id === localStorage.getItem("activeUID") &&
              ticket.status === "InProgress",
          );
          setTickets(List(filteredTickets));
        } 
        // show tickets the user is waiting to be paid for
        else if (statusFilter === "Awaiting Payment") {
          const filteredTickets = allTickets.filter(
            (ticket: TicketType) =>
              ticket.assigneduser_id === localStorage.getItem("activeUID") &&
              ticket.status === "Done",
          );
          setTickets(List(filteredTickets));
        } 
        // get all of the closed tickets a user has finished
        else if (statusFilter === "Closed") {
          const filteredTickets = allTickets.filter(
            (ticket: TicketType) =>
              ticket.assigneduser_id === localStorage.getItem("activeUID") &&
              ticket.status === "Closed",
          );
          setTickets(List(filteredTickets));
        }
      } catch (error) {
        setError("Failed to fetch tickets. Please try again later.");
      }
    };

    fetchTickets();
  }, [statusFilter, refresh]);

  // delete tickets
  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await deleteMessagesByTicket(ticketId);
      await deleteTicket(ticketId);
      const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);
      setTickets(List(updatedTickets));
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  const { Title } = Typography;

  return (
    <>
      {statusFilter === "Closed" ? (
        <div className="comp_feed">
          <Title level={2} style={{ color: '#1677ff', marginBottom: '16px', textAlign: 'center' }}>
            {statusFilter}
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
      ) : (
        <div className="feed">
          <Title level={2} style={{ color: '#1677ff', marginBottom: '16px', textAlign: 'center' }}>
            {statusFilter}
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
      )}
    </>
  );
};

export default ProfileFeed;
