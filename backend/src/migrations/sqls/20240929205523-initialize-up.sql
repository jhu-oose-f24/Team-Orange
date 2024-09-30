/* Replace with your SQL commands */
-- Table: public.users

--DROP TABLE IF EXISTS public.users;
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    age INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ticket (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    create_time TIMESTAMP DEFAULT NOW(),
    deadline TIMESTAMP,
    status VARCHAR(20) DEFAULT 'OPEN',
    owner_id INTEGER NOT NULL,
    assigneduser_id INTEGER,
    payment INTEGER DEFAULT 0,
    FOREIGN KEY (assigneduser_id) REFERENCES public.users (id),
    FOREIGN KEY (owner_id) REFERENCES public.users (id)
);
