CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category') THEN
        CREATE TYPE Category AS ENUM('Errands', 'Landscaping', 'Delivery', 'Pet Care', 'Cleaning', 'Gear Rental', 'Other');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
        CREATE TYPE Status AS ENUM('Open', 'InProgress', 'Done', 'Closed');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority') THEN
        CREATE TYPE Priority AS ENUM('Low', 'Medium', 'High');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100),
    age INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ticket (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    Category category NOT NULL,
    description TEXT NOT NULL,
    create_time TIMESTAMP DEFAULT NOW(),
    deadline TIMESTAMP,
    Priority priority DEFAULT 'Low',
    Status status DEFAULT 'Open',
    owner_id UUID NOT NULL,
    assigneduser_id UUID,
    payment INTEGER DEFAULT 0,
    payment_confirmed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (assigneduser_id) REFERENCES public.users (id),
    FOREIGN KEY (owner_id) REFERENCES public.users (id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sending_id UUID NOT NULL,
    receiving_id UUID NOT NULL,
    ticket_id UUID NOT NULL,
    FOREIGN KEY (sending_id) REFERENCES public.users (id),
    FOREIGN KEY (receiving_id) REFERENCES public.users (id),
    FOREIGN KEY (ticket_id) REFERENCES public.ticket (id),
    message TEXT NOT NULL,
    create_time TIMESTAMP DEFAULT NOW()
);