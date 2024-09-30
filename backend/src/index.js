const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const pg = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
// Enable CORS for all routes
app.use(cors());

// connect to PostgreSQL database
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'TicketSystem',
    password: '1234',
    port: 5432,
});
db.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

// GET endpoint to retrieve all tickets
app.get("/tickets", (req, res) => {
    db.query("SELECT * FROM ticket", (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(result.rows);
    });
});

// POST endpoint to create a new ticket
app.post("/tickets", (req, res) => {
    const { title, category, description, deadline, owner_id } = req.body;

    if (!title || !category || !description || !deadline || !owner_id) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Insert the new ticket into the database
    const query = `
        INSERT INTO ticket (title, category, description, deadline, owner_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    db.query(query, [title, category, description, deadline, owner_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.status(201).json(result.rows[0]); 
    });
});

// Example of database inserts
db.query("INSERT INTO users (name, age) VALUES ($1, $2)", ["Rayna", 6]);

db.query("INSERT INTO ticket (title, category, description, deadline, owner_id) VALUES ($1, $2, $3, $4, $5)",
    ["The first ticket", "cleaning", "I want someone to clean my room", "2024-10-31 23:59:59", 1]);

// Home route
app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");  // sending back HTML
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
