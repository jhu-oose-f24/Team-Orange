import React, { useState } from "react";
import editTicket from "../api/EditTicket";

import { Button, Card, Form, Input } from "antd";

interface TicketProps {
  id: number;
  title: string;
  description: string;
  category: string;
  deadline: string;
  owner_id: number;
  payment: number;
  onDelete: (ticketId: number) => void;
}

type EditTicketForm = {
  editTitle?: string;
  editDescription?: string;
  editCategory?: string;
  editDeadline?: string;
  editPayment?: number;
};

const Ticket: React.FC<TicketProps> = ({
  id,
  title,
  description,
  category,
  deadline,
  owner_id,
  payment,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDeadline, setEditDeadline] = useState(deadline.slice(0, -1));
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleSubmit = async (form: EditTicketForm) => {
    const updatedTicket = {
      title: form.editTitle,
      description: form.editDescription,
      category: form.editCategory,
      deadline: editDeadline,
      payment: form.editPayment,
    };

    try {
      await editTicket(id, updatedTicket);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  };

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete(id);
    setIsConfirmingDelete(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  return (
    <Card title={title} style={{ width: 600 }}>
      <p>{description}</p>
      <p>
        <strong>Category:</strong> {category}
      </p>
      <p>
        <strong>Owner ID:</strong> {owner_id}
      </p>
      <p>
        <strong>Payment: </strong> {`$${payment}`}
      </p>
      <p>
        <strong>Deadline:</strong> {new Date(deadline).toLocaleString()}
      </p>

      <Button type="primary" onClick={() => setIsEditing(true)}>
        Edit Ticket
      </Button>

      <Button onClick={handleDeleteClick}>Delete Ticket</Button>

      {isConfirmingDelete && (
        <div className="modal">
          <p>Are you sure you want to delete this ticket?</p>
          <Button type="primary" onClick={handleConfirmDelete}>
            Yes
          </Button>
          <Button onClick={handleCancelDelete}>Cancel</Button>
        </div>
      )}

      {isEditing && (
        <div className="modal">
          <Form
            name="EditTicketForm"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{
              editTitle: title,
              editDescription: description,
              editCategory: category,
              editDeadline: deadline.slice(0, -1),
              editPayment: payment,
            }}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item<EditTicketForm>
              label="EditTitle"
              name="editTitle"
              rules={[
                { required: true, message: "Please input your new title!" },
              ]}
            >
              <Input placeholder="Title" />
            </Form.Item>

            <Form.Item<EditTicketForm>
              label="EditDescription"
              name="editDescription"
              rules={[
                {
                  required: true,
                  message: "Please input your new description!",
                },
              ]}
            >
              <Input placeholder="Description" />
            </Form.Item>

            <Form.Item<EditTicketForm>
              label="EditCategory"
              name="editCategory"
              rules={[
                { required: true, message: "Please input your new category!" },
              ]}
            >
              <Input placeholder="Category" />
            </Form.Item>

            <Form.Item<EditTicketForm>
              label="EditDeadline"
              name="editDeadline"
              rules={[
                { required: true, message: "Please input your new deadline!" },
              ]}
            >
              <Input
                type="datetime-local"
                placeholder="Deadline"
                onChange={(e) => setEditDeadline(e.target.value)}
                required
              />
            </Form.Item>

            <Form.Item<EditTicketForm>
              label="EditPayment"
              name="editPayment"
              rules={[
                { required: true, message: "Please input your new payment!" },
              ]}
            >
              <Input placeholder="Payment" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Update Ticket
            </Button>
          </Form>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      )}
    </Card>
  );
};

export default Ticket;
