import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";

import createTicket from "../api/CreateTicket";

type CreateTicketForm = {
  title: string;
  description: string;
  category: string;
  status: string;
  deadline: string;
  ownerId: number;
  payment: string;
};

const CreateTicket: React.FC = () => {
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (form: CreateTicketForm) => {
    const newTicket = {
      title: form.title,
      description: form.description,
      category: form.category,
      status: form.status,
      deadline,
      owner_id: 1, // assing all to user 1 right now - can update later
      payment: Number(form.payment),
    };

    try {
      await createTicket(newTicket);
      setDeadline("");
      setSuccess(
        "Successfully Created your new ticket. View it in the Feed page.",
      );
    } catch (error) {
      setError("Failed to create ticket. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Create Ticket</h2>
      {/* Add your create ticket form here */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
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
          label="Status"
          name="status"
          rules={[{ required: true, message: "Select from a Status!" }]}
        > 
          <Select placeholder="Select a status" >
            <Select.Option value="Open">Open</Select.Option>
            <Select.Option value="InProgress">InProgress</Select.Option>
            <Select.Option value="Done">Done</Select.Option>
            <Select.Option value="Closed">Closed</Select.Option>
          </Select>
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
    </div>
  );
};

export default CreateTicket;
