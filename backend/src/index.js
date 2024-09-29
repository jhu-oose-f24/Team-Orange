import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import pg from 'pg';

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

// const createUsersTableQuery = `
//   CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100),
//     email VARCHAR(100)
//   );
// `;
// const createTicketTableQuery = `
//   CREATE TABLE IF NOT EXISTS ticket (
//     id SERIAL PRIMARY KEY,             
//     title VARCHAR(255) NOT NULL,       
//     category VARCHAR(50) NOT NULL,    
//     description TEXT  NOT NULL,                  
//     create_time TIMESTAMP DEFAULT NOW(), 
//     deadline TIMESTAMP,                
//     status VARCHAR(20) DEFAULT 'OPEN',
//     owner_id INTEGER NOT NULL,        
//     assignedUser_id INTEGER,           
//     payment INTEGER DEFAULT 0,         
//     FOREIGN KEY (owner_id) REFERENCES users (id),         
//     FOREIGN KEY (assignedUser_id) REFERENCES users (id)   
// );
// `;

// db.query(createUsersTableQuery, (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log("User Table created successfully");
//   }
// });

// db.query(createTicketTableQuery, (err, res) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("Ticket Table created successfully");
//     }
//   });

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
