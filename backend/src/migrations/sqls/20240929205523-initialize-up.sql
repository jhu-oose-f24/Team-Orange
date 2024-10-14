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
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    age INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ticket (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    Category category NOT NULL,
    description TEXT NOT NULL,
    create_time TIMESTAMP DEFAULT NOW(),
    deadline TIMESTAMP,
    Priority priority NOT NULL, 
    Status status DEFAULT 'Open',
    owner_id INTEGER NOT NULL,
    assigneduser_id INTEGER,
    payment INTEGER DEFAULT 0,
    FOREIGN KEY (assigneduser_id) REFERENCES public.users (id),
    FOREIGN KEY (owner_id) REFERENCES public.users (id)
);
