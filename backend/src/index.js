const express = require("express");
const { dirname } = require("path");
const { fileURLToPath } = require("url");
const bodyParser = require("body-parser");
const pg = require('pg');



const app = express();
const port = 3000;

// connect to my database
const db = new pg.Client({
    user: 'postgres',      
    host: 'localhost',
    database: 'TicketSystem',       
    password: '1234',
    port: 5432,
});
db.connect()
.then(() => console.log('Connected to PostgreSQL'));

db.query("INSERT INTO users (name, age) VALUES ($1, $2)",
        ["Rayna",6]);

db.query("INSERT INTO ticket (title , category,description, deadline, owner_id) VALUES ($1, $2, $3, $4, $5)",
        ["The first ticket", "cleaning", "I want someone to clean my room","2024-10-31 23:59:59", 1 ]);

app.get("/", (req, res)=>{
    //res.send("Hello world");
    res.send("<h1>Hello world</h1>"); // sending back html 
})
app.listen(port, () =>{
    console.log(`Server started on port ${port} `);
})
