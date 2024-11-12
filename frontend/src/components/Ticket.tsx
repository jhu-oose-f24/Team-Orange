import React, { useState, useEffect } from "react";
import editTicket from "../api/EditTicket";
import assignTicket from "../api/AssignTicket";
import Chat from "./Chat";

import { Button, Card, Form, Input, Modal } from "antd";

interface TicketProps {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  deadline: string;
  owner_id: string;
  assigneduser_id: string | null;
  payment: number;
  onDelete: (ticketId: string) => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
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
  assigneduser_id,
  payment,
  onDelete,
  setRefresh
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDeadline, setEditDeadline] = useState(deadline.slice(0, -1));
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  useEffect(() => {
    const userId = localStorage.getItem("activeUID");
    if (userId && userId === owner_id) {
      setIsOwner(true);
    }
  }, [owner_id]);

  useEffect(() => {
    const userId = localStorage.getItem("activeUID");
    if (userId && userId === assigneduser_id) {
      setIsAssigned(true);
    }
  }, [assigneduser_id]);

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
      setRefresh((prev) => !prev); // trigger refresh
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  };

  const handleAssign = async () => {
    const userId = localStorage.getItem("activeUID");
    if (userId) {
      try {
        await assignTicket(id, (userId));
        setIsAssigning(false);
        setRefresh((prev) => !prev); // trigger refresh
      } catch (error) {
        console.error("Failed to assign ticket:", error);
      }
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

  const handleChatModalClose = () => {
    setIsChatModalOpen(false);
  };

  return (
    <Card
      title={title}
      style={{ minWidth: 250, maxWidth: "100%", flexGrow: 1 }}
    >
      <p>{description}</p>
      <p>
        <strong>Category:</strong> {category}
      </p>
      <p>
        <strong>Owner ID:</strong> {owner_id}
      </p>
      <p>
        <strong>Assigned_user ID:</strong> {assigneduser_id}
      </p>
      <p>
        <strong>Payment: </strong> {`$${payment}`}
      </p>
      <p>
        <strong>Deadline:</strong> {new Date(deadline).toLocaleString()}
      </p>

      {isOwner && <Button type="primary" onClick={() => setIsEditing(true)}>
        Edit Ticket
      </Button>}

      {(!isOwner && !isAssigned) && (<Button type="primary" onClick={() => setIsAssigning(true)}>
        Pickup Ticket
      </Button>)}

      {isOwner && <Button onClick={handleDeleteClick}>Delete Ticket</Button>}

      {(isOwner || isAssigned) && <Button onClick={() => setIsChatModalOpen(true)}>
        Chat
      </Button>}

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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditDeadline(e.target.value)
                }
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
      {isAssigning && (
        <div className="modal">
          <p>Do you want to assign yourself to this ticket?</p>
          <Button type="primary" onClick={handleAssign}>
            Yes, Assign Me
          </Button>
          <Button onClick={() => setIsAssigning(false)}>Cancel</Button>
        </div>
      )}

      {/* Chat modal */}
      <Modal
        title="Chat"
        open={isChatModalOpen}
        onCancel={handleChatModalClose}
        footer={null} // Optional: remove default footer
        width={400} // Adjust width as needed
      >
        <Chat ticketId={id} ownerID={owner_id} assignedID={assigneduser_id || ""}/>
      </Modal>
    </Card>
  );
};

export default Ticket;
