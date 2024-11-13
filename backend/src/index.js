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
const saml = require("passport-saml");

const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;
const saltRound = 10;


const JHU_SSO_URL = "https://idp.jh.edu/idp/profile/SAML2/Redirect/SSO";
const SP_NAME = "glacial-plateau-47269";  // replace this with out app name
const BASE_URL = "https://glacial-plateau-47269.herokuapp.com"; // need to deploy ours
// key
const fs = require("fs");
const PbK = fs.readFileSync(__dirname + "/certs/cert.pem", "utf8");
const PvK = fs.readFileSync(__dirname + "/certs/key.pem", "utf8");
  
// Setup SAML strategy
const samlStrategy = new saml.Strategy(
  {
    // config options here
    entryPoint: JHU_SSO_URL,
    issuer: SP_NAME,
    callbackUrl: `${BASE_URL}/jhu/login/callback`,
    decryptionPvk: PvK,
    privateCert: PvK,
    cert: `-----BEGIN CERTIFICATE-----
    YOUR_IDP_PUBLIC_CERT_HERE
    -----END CERTIFICATE-----` 
  },
  (profile, done) => {
     // handle successful login 
     console.log(profile);
    return done(null, profile);
  }
);
// Tell passport to use the samlStrategy
passport.use("samlStrategy", samlStrategy);

// trust between our app(SP) and idp (metadata XML)
app.get("/jhu/metadata", (req, res) => {
    res.type("application/xml");
    res.status(200);
    res.send(samlStrategy.generateServiceProviderMetadata(PbK, PbK));
});
  
// middleware
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(
    session({ secret: "use-any-secret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(session({
    secret: "ORANGESECRET",
    resave: false,
    saveUninitialized: true // store uninitialized session to server memory
  }));
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

// use passport 
app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login", //fail
    failureFlash: true 
  }), (req, res) => {
    res.json({ message: "Login successful" });
});
  
// 
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const check_if_user_exist = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (check_if_user_exist.rows.length > 0) {
            const user = check_if_user_exist.rows[0];
            const storedHashedPassword = user.password;

            bcrypt.compare(password, storedHashedPassword, (err, result) => {
                if (err) {
                    return cb(err);
                } else {
                    if (result) {
                        return cb(null, user);
                    } else {
                        return cb(null, false, { message: "Incorrect password." });
                    }
                }
            });
        } else {
            return cb(null, false, { message: "User not found." });
        }
    } catch (err) {
        return cb(err);
    }
}));

passport.serializeUser((user, cb) =>{
    cb(null,user);
});
passport.deserializeUser((user, cb) =>{
    cb(null,user);
});

// Login route: redirect users to this when trying to access protected resourses
app.get(
    "/jhu/login",
    (req, res, next) => {
      next();
    },
    passport.authenticate("samlStrategy")
  );

// Callback routes: JHU SSO authenticate user and send 1. assertion and 2. POST request
app.post(
    "/jhu/login/callback",
    (req, res, next) => {
      next();
    },
    passport.authenticate("samlStrategy"),
    (req, res) => {
      // the user data is in req.user
      res.send(`welcome ${req.user.first_name}`);
      const username = req.user.username;
      const firstName = req.user.first_name;
      const lastName = req.user.last_name;
      const email = req.user.email;
      
      // check if user already in db
      
      // TODO: add the username, firstname, last name, email into the database

    }
  );
  
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
    const { title, startDate, endDate, owner_id, status, priority, ticket_id, minPayment, maxPayment, sortBy, sortOrder, category} = req.query;

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

    // No search by user implemented on front end
    if (owner_id) {
        queryParams.push(owner_id);
        query += ` AND owner_id = $${queryParams.length}`;
    }

    // Example: GET /tickets/search?title=Clean&status=Open&priority=Low

    if (status) {
        queryParams.push(status);
        query += ` AND status = $${queryParams.length}`;
    }

    if (priority) {
        queryParams.push(priority);
        query += ` AND priority = $${queryParams.length}`;
    }

    if (ticket_id) {
        queryParams.push(ticket_id);
        query += ` AND id = $${queryParams.length}`;
    }

    // GET /tickets/search?minPayment=5
    // GET /tickets/search?minPayment=5&maxPayment=100
    if (minPayment) {
        queryParams.push(minPayment);
        query += ` AND payment >= $${queryParams.length}`;
    }
    if (maxPayment) {
        queryParams.push(maxPayment);
        query += ` AND payment <= $${queryParams.length}`;
    }

    if (category) {
        queryParams.push(category);
        query += ` AND category = $${queryParams.length}`;
    }

    // Sorting
    // GET /tickets/search?sortBy=create_time&sortOrder=ASC
    // GET /tickets/search?sortBy=priority&sortOrder=DESC
    if (sortBy) {
        const validSortFields = ['create_time', 'priority', 'deadline', 'payment'];  // only allow sorting by these fields
        if (validSortFields.includes(sortBy)) {
            const order = sortOrder && sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';  // default to ascending order
            query += ` ORDER BY ${sortBy} ${order}`;
        }
    }


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

    const ticketId = uuidv4();   

    // Insert the new ticket into the database
    const query = `
        INSERT INTO ticket (id, title, category, status, description, deadline, owner_id, payment)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

    db.query(query, [ticketId, title, category, status, description, deadline, owner_id, payment], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.status(201).json(result.rows[0]);
    });
});

// GET endpoint to retrieve all users
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(result.rows);
    });
});

// POST endpoint to create a new user
// app.post("/users", (req, res) => {
//     const { name } = req.body;

//     if (!name ) {
//         return res.status(400).json({ error: "Name are required" });
//     }

//     const userId = uuidv4();  

//     const query = "INSERT INTO users (id, name, age) VALUES ($1, $2, $3) RETURNING *";

//     db.query(query, [userId, name, age], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: "Database insert failed" });
//         }
//         res.status(201).json(result.rows[0]);
//     });
// });


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


// get all messages for a ticket
app.get("/messages/:ticket_id", (req, res) => {
    const ticketId = req.params.ticket_id;

    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(ticketId)) {
        return res.status(400).json({ error: "Invalid ticket_id format" });
    }

    const query = "SELECT * FROM messages WHERE ticket_id = $1 ORDER BY create_time ASC";
    db.query(query, [ticketId], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: "Database query failed" });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No messages found for this ticket ID" });
        }
        res.json(result.rows);
    });
});


// POST endpoint to create a new message
app.post("/messages", (req, res) => {
    const { sending_id, receiving_id, ticket_id, message } = req.body;

    // validate required fields
    if (!sending_id || !receiving_id || !ticket_id || !message) {
        return res.status(400).json({ error: "sending_id, receiving_id, ticket_id, and message are required" });
    }

    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sending_id) || !uuidRegex.test(receiving_id) || !uuidRegex.test(ticket_id)) {
        return res.status(400).json({ error: "Invalid UUID format for sending_id, receiving_id, or ticket_id" });
    }

    // Check if the sending_id, receiving_id, and ticket_id exist in the database
    const checkExistenceQuery = `
        SELECT 
            (SELECT COUNT(*) FROM users WHERE id = $1) AS sending_exists,
            (SELECT COUNT(*) FROM users WHERE id = $2) AS receiving_exists,
            (SELECT COUNT(*) FROM ticket WHERE id = $3) AS ticket_exists;
    `;
    db.query(checkExistenceQuery, [sending_id, receiving_id, ticket_id], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: "Database query failed" });
        }

        const { sending_exists, receiving_exists, ticket_exists } = result.rows[0];

        if (sending_exists === '0') {
            return res.status(400).json({ error: "sending_id does not exist" });
        }
        if (receiving_exists === '0') {
            return res.status(400).json({ error: "receiving_id does not exist" });
        }
        if (ticket_exists === '0') {
            return res.status(400).json({ error: "ticket_id does not exist" });
        }

        // Generate a new UUID for the message
        const messageId = uuidv4();

        // Insert the new message into the database
        const insertQuery = `
            INSERT INTO messages (id, sending_id, receiving_id, ticket_id, message)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        db.query(insertQuery, [messageId, sending_id, receiving_id, ticket_id, message], (err, result) => {
            if (err) {
                console.error('Database insert error:', err);
                return res.status(500).json({ error: "Database insert failed" });
            }
            res.status(201).json(result.rows[0]);
        });
    });
});





// Example of database inserts
const userId = uuidv4();
// db.query("INSERT INTO users (id, name, age) VALUES ($1, $2, $3)", [userId, "Rayna", 6]);

const ticketId = uuidv4();
// db.query("INSERT INTO ticket (id, title, category, description, deadline, owner_id) VALUES ($1, $2, $3, $4, $5, $6)",
//     [ticketId, "The first ticket", "Cleaning", "I want someone to clean my room", "2024-10-31 23:59:59", userId]);


// // Home route
// app.get("/", (req, res) => {
//     res.send("<h1>Hello world</h1>");  // sending back HTML
// });

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
