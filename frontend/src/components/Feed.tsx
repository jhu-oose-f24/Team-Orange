import React, { useEffect, useState } from "react";
import { List } from "immutable";
import { Button, Card, Col, Form, Input, Row, Space } from "antd";

import Ticket from "./Ticket";
import getTickets from "../api/GetTickets";
import createTicket from "../api/CreateTicket";
import deleteTicket from "../api/DeleteTicket";

type CreateTicketForm = {
  title: string;
  description: string;
  category: string;
  deadline: string;
  ownerId: number;
  payment: string;
};

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
  const [deadline, setDeadline] = useState("");
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
  }, [tickets]);

  const handleSubmit = async (form: CreateTicketForm) => {
    const newTicket = {
      title: form.title,
      description: form.description,
      category: form.category,
      deadline,
      owner_id: 1, // assing all to user 1 right now - can update later
      payment: Number(form.payment),
    };

    try {
      const createdTicket = await createTicket(newTicket);
      setTickets(tickets.push(createdTicket));
      setDeadline("");
    } catch (error) {
      setError("Failed to create ticket. Please try again later.");
    }
  };

  const handleDeleteTicket = async (ticketId: number) => {
    try {
      await deleteTicket(ticketId);
      const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);
      setTickets(List(updatedTickets));
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  return (
    <div className="feed">
      {error && <div className="error">{error}</div>}
      <Form
        name="CreateTicketForm"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item<CreateTicketForm>
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input a title!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<CreateTicketForm>
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input a description!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<CreateTicketForm>
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please input a category!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<CreateTicketForm>
          label="Payment"
          name="payment"
          rules={[{ required: true, message: "Please input a payment!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<CreateTicketForm>
          label="Deadline"
          name="deadline"
          rules={[{ required: true, message: "Please input a deadline!" }]}
        >
          <Input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Create Ticket
        </Button>
      </Form>

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
