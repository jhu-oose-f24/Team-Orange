const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const pg = require('pg');
const cors = require('cors');
const bcrypt = require("bcrypt");
// const { password } = require("pg/lib/defaults");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');


const app = express();
const port = 3000;
const saltRound = 10;

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static("public"));
app.use(session({
    secret: "ORANGESECRET",
    resave: false,
    saveUninitialized: true // store uninitialized session to server memory
  }));
  app.use(password.initialize());
  app.use(password.session());

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


// Authentication 
app.get("/login", (req, res) => {
    res.render("login.ejs"); // delete 
});

app.get("/register", (req, res) => {
    res.render("register.ejs"); // delete 
});

app.post("/register", async (req, res) => {
    console.log(req.body);
    let email = req.body["username"];
    let password = req.body["password"];

    try{
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }  
        const check_if_user_exist = await db.query("SELECT * FROM users WHERE email = $1",[email]);
        if (check_if_user_exist.rows.length>0){
            res.send("Email already exists, try logging in ...");
        }else{
            bcrypt.hash(password,saltRound,async (err, hash)=>{
            if (err){
                console.log("Error hashing functions: ", err);
              }else{
                const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email,hash]);
                // TODO: redirect to the login page
                res.json({ message: "Registration successful" }); 
              }
             })
        }
    } catch(err){
        console.log(err);
    }

});

// app.post("/login", async (req, res) => {
//     let email = req.body["username"];
//     let loginPassword = req.body["password"];
//     try{
//         const check_if_user_exist = await db.query("SELECT * FROM users WHERE email = $1 ",[email]);
//         if (check_if_user_exist.rows.length>0){
//             const user = check_if_user_exist.rows[0];
//             const storedHashedPassword = user.password; // stored(right) password 

//             bcrypt.compare(loginPassword, storedHashedPassword, (err, result)=>{ 
//                 if (err){
//                     console.log("Erroring comparing password",err);
//                     res.status(500).json({ message: "Internal server error" });
//                 }else{
//                     console.log(result);
//                     if (result){ // boolean 
//                         // entering true password
//                         res.json({ message: "Login successful" }); 
//                     }else{
//                         // password entered incorrect 
//                         res.status(401).json({ message: "Password incorrect" });
//                     }
//                 }
//             })
//         }else{
//             res.status(404).json({ message: "User not found" });
//         }
//     } catch(err){
//         console.log(err);
//         res.status(500).json({ message: "Internal server error" });
//     }

// });


// use passport 
app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login", //fail
    failureFlash: true 
  }), (req, res) => {
    res.json({ message: "Login successful" });
});
  
passport.use(LocalStrategy(async function verify(username, password, cb){
    try{
        const check_if_user_exist = await db.query("SELECT * FROM users WHERE email = $1 ",[email]);
        if (check_if_user_exist.rows.length>0){
            const user = check_if_user_exist.rows[0];
            const storedHashedPassword = user.password; // stored(right) password 

            bcrypt.compare(loginPassword, storedHashedPassword, (err, result)=>{ 
                if (err){
                    return cb(err);
                    // res.status(500).json({ message: "Internal server error" });
                }else{
                    if (result){ // boolean 
                        return cb(null,user);
                        // res.json({ message: "Login successful" }); 
                    }else{
                        return cb(null, false);
                        // res.status(401).json({ message: "Password incorrect" });
                    }
                }
            })
        }else{
            return cb("user not found");
            // res.status(404).json({ message: "User not found" });
        }
    } catch(err){
        return cb(err);
        // console.log(err);
        // res.status(500).json({ message: "Internal server error" });
    }

}))

password.serializeUser((user, cb) =>{
    cb(null,user);
});
password.deserializeUser((user, cb) =>{
    cb(null,user);
});
    

// GET endpoint to retrieve all tickets
app.get("/tickets", (req, res) => {

    db.query("SELECT * FROM ticket", (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(result.rows);
    });
});

// GET endpoint to search for specific tickets
app.get("/tickets/search", (req, res) => {
    const { title, startDate, endDate, owner_id } = req.query;

    let query = "SELECT * FROM ticket WHERE 1=1";
    let queryParams = [];

    if (title) {
        queryParams.push(`%${title}%`);
        query += ` AND title ILIKE $${queryParams.length}`;
    }

    if (startDate && endDate) {
        queryParams.push(startDate, endDate);
        query += ` AND deadline BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
    } else if (startDate) {
        queryParams.push(startDate);
        query += ` AND deadline >= $${queryParams.length}`;
    } else if (endDate) {
        queryParams.push(endDate);
        query += ` AND deadline <= $${queryParams.length}`;
    }

    /* No search by user implemented on front end
    if (owner_id) {
        queryParams.push(owner_id);
        query += ` AND owner_id = $${queryParams.length}`;
    }
     */
    db.query(query, queryParams, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(result.rows);
    });
});


// POST endpoint to create a new ticket
app.post("/tickets", (req, res) => {
    const { title, category, status, description, deadline, owner_id, payment } = req.body;

    if (!title || !category || !description || !deadline || !owner_id || payment === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // check category, type 

    // Insert the new ticket into the database
    const query = `
        INSERT INTO ticket (title, category, status, description, deadline, owner_id, payment)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    db.query(query, [title, category, status, description, deadline, owner_id, payment], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.status(201).json(result.rows[0]);
    });
});


// PUT endpoint to partially update a ticket by ID
app.put("/tickets/:id", (req, res) => {
    const ticketId = req.params.id;
    const { title, category, description, deadline, status, owner_id, assigneduser_id, payment } = req.body;

    db.query("SELECT * FROM ticket WHERE id = $1", [ticketId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        const currentTicket = result.rows[0];

        const updatedTicket = {
            title: title || currentTicket.title,
            category: category || currentTicket.category,
            description: description || currentTicket.description,
            deadline: deadline || currentTicket.deadline,
            status: status || currentTicket.status,
            owner_id: owner_id || currentTicket.owner_id,
            assigneduser_id: assigneduser_id !== undefined ? assigneduser_id : currentTicket.assigneduser_id, //allow null value
            payment: payment !== undefined ? payment : currentTicket.payment, // allow zero value
        };

        // update the ticket in the database
        const query = `
            UPDATE ticket
            SET title = $1, category = $2, description = $3, deadline = $4, status = $5, owner_id = $6, assigneduser_id = $7, payment = $8
            WHERE id = $9
            RETURNING *;
        `;

        db.query(query, [
            updatedTicket.title, updatedTicket.category, updatedTicket.description,
            updatedTicket.deadline, updatedTicket.status, updatedTicket.owner_id,
            updatedTicket.assigneduser_id, updatedTicket.payment, ticketId
        ], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database update failed" });
            }

            res.status(200).json(result.rows[0]);
        });
    });
});

// DELETE endpoint to delete a ticket by ID
app.delete("/tickets/:id", (req, res) => {
    const ticketId = req.params.id;

    // Delete the ticket from the database
    const query = `
        DELETE FROM ticket
        WHERE id = $1
        RETURNING *;
    `;
    db.query(query, [ticketId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database delete failed" });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Ticket not found" });
        }
        res.status(200).json({ message: "Ticket deleted successfully" });
    });
});


// Example of database inserts
// db.query("INSERT INTO users (name, age) VALUES ($1, $2)", ["Rayna", 6]);

// db.query("INSERT INTO ticket (title, category, description, deadline, owner_id) VALUES ($1, $2, $3, $4, $5)",
//     ["The first ticket", "Cleaning", "I want someone to clean my room", "2024-10-31 23:59:59", 1]);

// // Home route
// app.get("/", (req, res) => {
//     res.send("<h1>Hello world</h1>");  // sending back HTML
// });

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
