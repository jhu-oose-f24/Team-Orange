import React, { useState, useEffect } from "react";
import editTicket from "../api/EditTicket";
import assignTicket from "../api/AssignTicket";
import Chat from "./Chat";

import { Button, Card, Form, Input, Modal, Select } from "antd";
import { 
  DollarOutlined, 
} from '@ant-design/icons';

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
  status,
  category,
  deadline,
  owner_id,
  assigneduser_id,
  payment,
  onDelete,
  setRefresh
}) => {
  const [editDeadline, setEditDeadline] = useState(deadline.slice(0, -1));
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAssignedUser, setIsAssignedUser] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isMarkingAsDone, setIsMarkingAsDone] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("activeUID");
    if (userId && userId === owner_id) {
      setIsOwner(true);
    }
  }, [owner_id]);

  useEffect(() => {
    const userId = localStorage.getItem("activeUID");
    if (userId && userId === assigneduser_id) {
      setIsAssignedUser(true);
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
      console.log("Updating ticket:", updatedTicket);
      await editTicket(id, updatedTicket);
      setIsEditModalVisible(false);
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

  const handleMarkAsDone = async () => {
    const updatedTicket = {
      status: "Done"
    };
    try {
      await editTicket(id, (updatedTicket))
      setRefresh((prev) => !prev); // trigger refresh
    } catch (error) {
      console.error("Failed to mark ticket as Done:", error);
    }
  }

  const handleConfirmPayment = async () => {
    const updatedTicket = {
      status: "Closed",
      payment_confirmed: true,
    };
    try {
      await editTicket(id, (updatedTicket))
      setRefresh((prev) => !prev); // trigger refresh
    } catch (error) {
      console.error("Failed to confirm ticket payment:", error);
    }
  }

  const handleConfirmPaymentClick = () => {
    handleConfirmPayment();
    setIsConfirmingPayment(false);
  }

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

  const showEditModal = () => {
    setIsEditModalVisible(true);
  };
  const handleCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleConfirmMarkAsDone = () => {
    handleMarkAsDone();
    setIsMarkingAsDone(false);
  }

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
      {assigneduser_id && (<p>
        <strong>Assigned_user ID:</strong> {assigneduser_id}
      </p>)}
      <p>
        <strong>Payment: </strong> {`$${payment}`}
      </p>
      <p>
        <strong>Deadline:</strong> {new Date(deadline).toLocaleString()}
      </p>

      {isOwner && <Button type="primary" onClick={showEditModal}>
        Edit Ticket
      </Button>}

      {(!isOwner && !assigneduser_id) && (<Button type="primary" onClick={() => setIsAssigning(true)}>
        Pickup Ticket
      </Button>)}

      {isOwner && <Button onClick={handleDeleteClick}>Delete Ticket</Button>}

      {(isOwner || isAssignedUser) && assigneduser_id && status !== "Done" && <Button onClick={() => setIsChatModalOpen(true)}>
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

      <Modal
        title="Edit Ticket"
        open={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
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
            label="Title"
            name="editTitle"
            rules={[{ required: true, message: "Please input your new title!" }]}
            style={{ height: '40px', width: '100%' }}
          >
            <Input placeholder="Title" />
          </Form.Item>

          <Form.Item<EditTicketForm>
            label="Description"
            name="editDescription"
            rules={[{ required: true, message: "Please input your new description!" }]}
            style={{ width: '100%' }}
          >
            <Input.TextArea 
              placeholder="Description"
              autoSize={{ minRows: 3, maxRows: 6 }}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item<EditTicketForm>
            label="Category"
            name="editCategory"
            rules={[{ required: true, message: "Please input your new category!" }]}
            style={{ width: '100%' }}
          >
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

          <Form.Item<EditTicketForm>
            label="Deadline"
            name="editDeadline"
            rules={[{ required: true, message: "Please input your new deadline!" }]}
            style={{ width: '100%' }}
          >
            <Input
              type="datetime-local"
              placeholder="Deadline"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditDeadline(e.target.value)
              }
              required
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item<EditTicketForm>
            label="Payment"
            name="editPayment"
            rules={[{ required: true, message: "Please input your new payment!" }]}
            style={{ width: '100%' }}
          >
            <Input 
              prefix={<DollarOutlined />} 
              placeholder="Enter payment amount"
              type="number"
              min={0}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              Update Ticket
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      
      {isAssigning && status === "Open" && (
        <div className="modal">
          <p>Do you want to assign yourself to this ticket?</p>
          <Button type="primary" onClick={handleAssign}>
            Yes, Assign Me
          </Button>
          <Button onClick={() => setIsAssigning(false)}>Cancel</Button>
        </div>
      )}

      { (isAssignedUser && status === "InProgress") && (
        <Button type="primary" onClick={() => setIsMarkingAsDone(true)}>
        Mark as Done
      </Button>
      )}

      { (isAssignedUser && status === "Done") && (
        <Button type="primary" onClick={() => setIsConfirmingPayment(true)}>
        Confirm Payment
      </Button>
      )}

      {isConfirmingPayment && (
        <div className="modal">
        <p>Do you want to confirm that you have been paid for this ticket?</p>
        <Button type="primary" onClick={handleConfirmPaymentClick}>
          Yes, Confirm Payment Received
        </Button>
        <Button onClick={() => setIsConfirmingPayment(false)}>Cancel</Button>
      </div>
      )}

      {isMarkingAsDone && (
        <div className="modal">
        <p>Do you want to mark this ticket as Done?</p>
        <Button type="primary" onClick={handleMarkAsDone}>
          Yes, Mark as Done
        </Button>
        <Button onClick={() => setIsMarkingAsDone(false)}>Cancel</Button>
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
