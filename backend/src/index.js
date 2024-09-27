import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

// ! I will update this once our database is ready
let tickets = [];

// Send back the list of tickets as JSON
app.get("/tickets", (req, res) => {
    res.json(tickets);  
});

// POST endpoint to create a new ticket
app.post("/tickets", (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    // Create a new ticket with an auto-incremented ID
    const newTicket = {
        id: tickets.length + 1,
        title: title,
    };

    tickets.push(newTicket);

    res.status(201).json(newTicket);
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
