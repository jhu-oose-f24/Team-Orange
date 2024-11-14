const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// const { Client } = require('pg');
const pg = require('pg');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');
const saml = require('passport-saml').Strategy;
const session = require('express-session');
const fs = require('fs');

const certPath = path.join(__dirname, 'certs', 'cert.pem');
const keyPath = path.join(__dirname, 'certs', 'key.pem');
const PbK = fs.readFileSync(certPath, 'utf8');
const PvK = fs.readFileSync(keyPath, 'utf8');

const JHU_SSO_URL = "https://idp.jh.edu/idp/profile/SAML2/Redirect/SSO";
const SP_NAME = process.env.SP_NAME || "chorehop-sso-99eceafc63f6";
const BASE_URL = process.env.BASE_URL || "https://chorehop-sso-99eceafc63f6.herokuapp.com";

const samlStrategy = new saml(
    {
      entryPoint: JHU_SSO_URL,
      issuer: SP_NAME,
      callbackUrl: `${BASE_URL}/jhu/login/callback`,
      cert: PbK, 
      decryptionPvk: PvK,
      privateCert: PvK,
    },
    (profile, done) => {
      // poential error here with username
      const username = profile['user_name'] || '';
    //   const username = profile['username'] || '';
    //   const username = profile['urn:oid:0.9.2342.19200300.100.1.1'];
      const firstName = profile['first_name'] || '';
      const lastName = profile['last_name'] || '';
      const email = profile['email'] || '';
  
      db.query('SELECT * FROM users WHERE Username = $1', [username], (err, result) => {
        if (err) {
          return done(err);
        }
        if (result.rows.length > 0) {
          return done(null, result.rows[0]);
        } else {
          const userId = uuidv4();
          const newUser = {
            id: userId,
            Username: username,
            Lastname: lastName,
            Firstname: firstName,
            Email: email
          };
          const insertQuery = `
            INSERT INTO users (id, Username, Lastname, Firstname, Email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
          `;
          db.query(insertQuery, [newUser.id, newUser.Username, newUser.Lastname, newUser.Firstname, newUser.Email], (err, result) => {
            if (err) {
              return done(err);
            }
            return done(null, result.rows[0]);
          });
        }
      });
    }
  );

  passport.use("samlStrategy", samlStrategy);

const app = express();
const port = process.env.PORT || 3000;

// first line could be removed. 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    // secret: process.env.SESSION_SECRET || 'your_secret_key',
    secret: "use-any-secret",
    resave: false,
    saveUninitialized: true
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());

require('dotenv').config();

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

db.connect()
    .then(() => console.log('Connected to Supabase PostgreSQL'))
    .catch(err => console.error('Connection error1', err.stack));


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


app.get("/jhu/login", passport.authenticate("samlStrategy"));

app.post("/jhu/login/callback", passport.authenticate("samlStrategy"), (req, res) => {
  res.redirect('/'); // or other route
});

// metadata (optional)
// app.get("/jhu/metadata", (req, res) => {
//   res.type("application/xml");
//   res.status(200).send(
//     samlStrategy.generateServiceProviderMetadata(PbK, PvK)
//   );
// });

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/jhu/login');
  }


// //ensure Authenticated
// app.get("/tickets", ensureAuthenticated, (req, res) => {
//     // code here
//   });
  
//   app.post("/tickets", ensureAuthenticated, (req, res) => {
//     // code here
//   });
  

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

    const query = `
        INSERT INTO ticket (id, title, category, status, description, deadline, owner_id, payment, payment_confirmed)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE)
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
    db.query("SELECT id, Username, Lastname, Firstname, Email FROM users", (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(result.rows);
    });
});

// POST endpoint to create a new user
app.post("/users", (req, res) => {
    const { Username, Lastname, Firstname, Email } = req.body;

    if (!Username || !Lastname || !Firstname || !Email) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const userId = uuidv4();

    const query = `
        INSERT INTO users (id, Username, Lastname, Firstname, Email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    db.query(query, [userId, Username, Lastname, Firstname, Email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.status(201).json(result.rows[0]);
    });
});


// PUT endpoint to partially update a ticket by ID
app.put("/tickets/:id", (req, res) => {
    const ticketId = req.params.id;
    const { title, category, description, deadline, status, owner_id, assigneduser_id, payment, payment_confirmed } = req.body;

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
            assigneduser_id: assigneduser_id !== undefined ? assigneduser_id : currentTicket.assigneduser_id,
            payment: payment !== undefined ? payment : currentTicket.payment,
            payment_confirmed: payment_confirmed !== undefined ? payment_confirmed : currentTicket.payment_confirmed,
        };

        const query = `
            UPDATE ticket
            SET title = $1, category = $2, description = $3, deadline = $4, status = $5,
                owner_id = $6, assigneduser_id = $7, payment = $8, payment_confirmed = $9
            WHERE id = $10
            RETURNING *;
        `;

        db.query(query, [
            updatedTicket.title, updatedTicket.category, updatedTicket.description,
            updatedTicket.deadline, updatedTicket.status, updatedTicket.owner_id,
            updatedTicket.assigneduser_id, updatedTicket.payment, updatedTicket.payment_confirmed, ticketId
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
        // if (result.rows.length === 0) {
        //     return res.status(404).json({ error: "No messages found for this ticket ID" });
        // }
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

app.delete("/messages", (req, res) => {
    const { ticket_id } = req.body; 
  
    // validate that ticket_id is provided
    if (!ticket_id) {
      return res.status(400).json({ error: "ticket_id is required" });
    }
  
    // UUID validation for ticket_id
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(ticket_id)) {
      return res.status(400).json({ error: "Invalid ticket_id format" });
    }
  
    // check if the ticket exists in the database
    const checkExistenceQuery = "SELECT * FROM ticket WHERE id = $1";
    db.query(checkExistenceQuery, [ticket_id], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: "Database query failed" });
      }
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Ticket not found" });
      }
  
      // delete all messages for this ticket
      const deleteQuery = "DELETE FROM messages WHERE ticket_id = $1";
      db.query(deleteQuery, [ticket_id], (err) => {
        if (err) {
          console.error('Database delete error:', err);
          return res.status(500).json({ error: "Failed to delete messages" });
        }
  
        res.status(204).send(); // No content, successful deletion
      });
    });
  });
  
// Home route
app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");  // sending back HTML
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});