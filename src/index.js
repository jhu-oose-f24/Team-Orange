import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import pg from 'pg';

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

const app = express();
const port = 3000;

app.get("/", (req, res)=>{
    //res.send("Hello world");
    res.send("<h1>Hello world</h1>"); // sending back html 
})
app.listen(port, () =>{
    console.log(`Server started on port ${port} `);
})
