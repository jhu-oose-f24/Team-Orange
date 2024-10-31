import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";

import createTicket from "../api/CreateTicket";

type CreateTicketForm = {
  title: string;
  description: string;
  category: string;
  status: string;
  deadline: string;
  ownerId: string;
  assigneduser_id: string | undefined;
  payment: string;
  priority: string;
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
      owner_id: String(localStorage.getItem('activeUID')), 
      assigneduser_id: undefined, // this will also change when we add more users and user fetching/searching
      payment: Number(form.payment),
      priority: form.priority,
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

        {/* We will also need a dropdown for assigned user/owner here */}

        <Form.Item<CreateTicketForm>
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please input a category!" }]}
        >
          {/* // 'Errands', 'Landscaping', 'Delivery', 'Pet Care', 'Cleaning', 'Gear Rental', 'Other' */}
          <Select placeholder="Select a Category">
            <Select.Option value="Errands">Errands</Select.Option>
            <Select.Option value="Landscaping">Landscaping</Select.Option>
            <Select.Option value="Delivery">Delivery</Select.Option>
            <Select.Option value="Pet Care">Pet Care</Select.Option>
            <Select.Option value="Cleaning">Cleaning</Select.Option>
            <Select.Option value="Gear Rental">Gear Rental</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item<CreateTicketForm>
          label="Status"
          name="status"
          rules={[{ required: true, message: "Select from a Status!" }]}
        >
          <Select placeholder="Select a status">
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
        <Form.Item<CreateTicketForm>
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Please input a priority!" }]}
        >
          <Select placeholder="Select a priority">
            <Select.Option value="Low">Low</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="High">High</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Create Ticket
        </Button>
      </Form>
    </div>
  );
};

export default CreateTicket;
