import React, { useState } from "react";
import { Button, Form, Input, Select, Card, Row, Col, Typography, Space, message } from "antd";
import { 
  DollarOutlined, 
  CalendarOutlined, 
  TagOutlined, 
  ProfileOutlined, 
  FlagOutlined
} from '@ant-design/icons';
import createTicket from "../api/CreateTicket";
import { $isLoggedIn } from "../store/store";
import { useStore } from "@nanostores/react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

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
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const isLoggedIn = useStore($isLoggedIn);

  const handleSubmit = async (formData: CreateTicketForm) => {
    try {
      const newTicket = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: "Open",
        deadline,
        owner_id: String(localStorage.getItem('activeUID')),
        assigneduser_id: undefined,
        payment: Number(formData.payment),
        priority: formData.priority,
      };

      await createTicket(newTicket);
      message.success("Ticket created successfully!");
      form.resetFields();
      setDeadline("");
    } catch (error) {
      message.error("Failed to create ticket. Please try again.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Button type="primary" onClick={() => navigate("/")}>
          Login
        </Button>
      </div>
    );
  }

  return (
    <Row justify="center" style={{ padding: '24px' }}>
      <Col xs={24} sm={22} md={20} lg={18} xl={16}>
        <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={2} style={{ textAlign: 'center', margin: 0 }}>Create New Ticket</Title>
            
            <Form
              form={form}
              name="CreateTicketForm"
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark="optional"
              style={{ maxWidth: '100%' }}
            >
              <Form.Item<CreateTicketForm>
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please input a title!" }]}
                style={{ height: '40px', width: '50%' }}
              >
                <Input prefix={<ProfileOutlined />} placeholder="Enter ticket title" />
              </Form.Item>

              <Form.Item<CreateTicketForm>
                label="Description"
                name="description"
                rules={[{ required: true, message: "Please input a description!" }]}
                style={{ width: '50%' }}
              >
                <Input.TextArea 
                  placeholder="Enter ticket description"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Form.Item<CreateTicketForm>
                label={
                  <Space>
                    <TagOutlined />
                    Category
                  </Space>
                }
                name="category"
                rules={[{ required: true, message: "Please select a category!" }]}
                style={{ height: '40px', width: '50%' }}
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


              <Form.Item<CreateTicketForm>
                label="Payment"
                name="payment"
                rules={[{ required: true, message: "Please input a payment amount!" }]}
                style={{ height: '40px', width: '50%' }}
              >
                <Input 
                  prefix={<DollarOutlined />} 
                  placeholder="Enter payment amount"
                  type="number"
                  min={0}
                  
                />
              </Form.Item>

              <Form.Item<CreateTicketForm>
                label="Deadline"
                name="deadline"
                rules={[{ required: true, message: "Please select a deadline!" }]}
                style={{ height: '40px', width: '50%' }}
              >
                <Input
                  prefix={<CalendarOutlined />}
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </Form.Item>

              <Form.Item<CreateTicketForm>
                label={
                  <Space>
                    <FlagOutlined />
                    Priority
                  </Space>
                }
                name="priority"
                rules={[{ required: true, message: "Please select a priority!" }]}
                style={{ height: '40px', width: '50%' }}
              >
                <Select placeholder="Select Priority">
                  <Select.Option value="Low">Low</Select.Option>
                  <Select.Option value="Medium">Medium</Select.Option>
                  <Select.Option value="High">High</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item style={{ marginTop: '24px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  style={{ height: '48px' }}
                >
                  Create Ticket
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default CreateTicket;
