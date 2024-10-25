INSERT INTO public.users (id, name, age) VALUES 
('011ff2c1-1ade-4c92-a649-9725f85aec00', 'John Doe', 30),
('022ff2c1-1ade-4c92-a649-9725f85aec11', 'Jane S', 28),
('033ff2c1-1ade-4c92-a649-9725f85aec22', 'Alice Smith', 35);

INSERT INTO public.ticket (id, title, category, description, deadline, owner_id, priority, payment) VALUES 
('101ff2c1-1ade-4c92-a649-9725f85aec00', 'Fix the server', 'Errands', 'The server is down', '2024-12-31 23:59:59', '011ff2c1-1ade-4c92-a649-9725f85aec00', 'High', 5),
('102ff2c1-1ade-4c92-a649-9725f85aec11', 'Clean the office', 'Cleaning', 'Clean the office area', '2024-11-30 23:59:59', '022ff2c1-1ade-4c92-a649-9725f85aec11', 'Medium', 20),
('103ff2c1-1ade-4c92-a649-9725f85aec22', 'Deliver the package', 'Delivery', 'Deliver a package to client', '2024-10-31 23:59:59', '033ff2c1-1ade-4c92-a649-9725f85aec22', 'Low', 100),
('104ff2c1-1ade-4c92-a649-9725f85aec00', 'Replace the projector', 'Other', 'Replace the old projector in the meeting room', '2024-11-15 23:59:59', '011ff2c1-1ade-4c92-a649-9725f85aec00', 'High', 3),
('105ff2c1-1ade-4c92-a649-9725f85aec11', 'Organize a team event', 'Errands', 'Plan and organize a team event for this month', '2024-11-05 23:59:59', '022ff2c1-1ade-4c92-a649-9725f85aec11', 'Medium', 15);

INSERT INTO public.messages (id, sending_id, receiving_id, ticket_id, message, create_time) VALUES 
('111ff2c1-1ade-4c92-a649-9725f85aec00', '011ff2c1-1ade-4c92-a649-9725f85aec00', '022ff2c1-1ade-4c92-a649-9725f85aec11', '101ff2c1-1ade-4c92-a649-9725f85aec00', 'Hi, Jane', '2024-12-31 23:59:59')
('222ff2c1-1ade-4c92-a649-9725f85aec00',  '022ff2c1-1ade-4c92-a649-9725f85aec11', '011ff2c1-1ade-4c92-a649-9725f85aec00', '101ff2c1-1ade-4c92-a649-9725f85aec00', 'Hi, John', '2024-12-31 23:59:59')