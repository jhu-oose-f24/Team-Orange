const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const pg = require('pg');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');
const saml = require("passport-saml");
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

const JHU_SSO_URL ="https://login.jh.edu/idp/profile/SAML2/Redirect/SSO";
const SP_NAME = process.env.SP_NAME || "chorehop-cc7c0bf7a12c";  // replace this with out app name
const BASE_URL = process.env.BASE_URL ||  "https://chorehop-cc7c0bf7a12c.herokuapp.com/"; // need to deploy ours

const PbK_idp = `
-----BEGIN CERTIFICATE-----
MIIEGzCCAoOgAwIBAgIUJTtiXBcXQ01+vJXrxmI9WCM6Bz8wDQYJKoZIhvcNAQEL BQAwFzEVMBMGA1UEAwwMbG9naW4uamguZWR1MB4XDTI0MDExMDE3MzYzMloXDTQ0 MDExMDE3MzYzMlowFzEVMBMGA1UEAwwMbG9naW4uamguZWR1MIIBojANBgkqhkiG 9w0BAQEFAAOCAY8AMIIBigKCAYEAwm+SLvs4AyRroVi06uX2ZIhJcIuWdnw5a1vJ 8uW50HOrqvhbBGB6qbcat3JM9WnwNPuK7gspSmB/GCV2s4vzGgdSwziZj53J+Mnv 8JQfmlHsW05u6atJI6q+ssy/P/KXuiL1gK6Ca6nO3msa/zVT7t//n6czvHJkUfeR 8BlFvwug3fEFXWxpORAfX99mJ/je+JiSM+M+9IVYDboISraoWKY0bgTKrvmXvqla Fp27r+ed7UnDWGKg4TmyNgHn6fd2j1+L5A9AvOCWIjFPhsC5KFSjNMTXEmOMr2v0 YF4Cc61v0lNBweDI7cx9IRCLtlJnuHG5BvLHU+K6MjT6Q8o7+93dLBUnqY0fy9od UsV5WZbyAANar+wDpTUSRNdrXtZbJOY0BBhGFUtyxHOkydFiq7F648blpkiDDl86 DUy+EpucTPaky9q3orVHjiDmehJwGix7vxMyWdf12qMT1e/34dBBAnbZcly9NTBE gprygch3/JSyQgVfjCpJhD5LMhkdAgMBAAGjXzBdMB0GA1UdDgQWBBSdTEIrUneu f2iXzxjv+XvcCuJO4jA8BgNVHREENTAzggxsb2dpbi5qaC5lZHWGI2h0dHBzOi8v bG9naW4uamguZWR1L2lkcC9zaGliYm9sZXRoMA0GCSqGSIb3DQEBCwUAA4IBgQBc ELRXh8jmiN/1A1Hajm51wjeepejICXRHvM3ATxwtE/Ef3jYqSOhjrRJz9V4dkn+a 5dJ/xfXp0jWFIXmtjy43Z6SNC5RK36/62N8nFOhtyy5v11ta8XFfERaAwihnmYIy PmyKc8nR7vllegJ+pB3FiparOezCkWRK1kLR3i+o28GirIgE6ZnlCSiYgWTcl+S1 NOknYRFC5DoZwzIS4ndfCGNoeAYgS+dtyCNwD3Few5UTBqyPYKhgWMNU1mu+tTd1 bMaz4PfdWPKmHP3/1zPPHg/6LZeHx3A5cCMuhBjskGYx9f/nlAhpyiFUuWbdF1Xv dJB+euWpl1fgSxREp3R2apfWCH4fXFLiZMOUNnh8AtBsj+4mgFtGtuybo7vQdS2X oBZuIb1hmbRZO/g/dBl/bZmK/wqRgETw5xuicbXYAriDvazshaG+JMyfOmqVUFCl 81VZ1CNIM8/SPJI2v7MRpBH+qvvukkb5I71FKc7HndVBRzcVghME7TLJn5hykoM=
-----END CERTIFICATE-----
`;
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
    callbackUrl: "https://chorehop-cc7c0bf7a12c.herokuapp.com/jhu/login/callback",
    decryptionPvk: PvK,
    cert: PbK_idp, 
    privateKey: PvK,  
    authnContext: [], 
  },
  (profile, done) => {
    return done(null, profile);
  }
);
// Tell passport to use the samlStrategy
passport.use("samlStrategy", samlStrategy);
  
// middleware
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(cors());


app.use(session({
    // secret: process.env.SESSION_SECRET || 'your_secret_key',
    secret: "useanysecret",
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use(express.static("public"));
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
    .then(() => console.log('Connected to Supabase Supabase PostgreSQL'))
    .catch(err => console.error('Connection error11', err.stack));


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
    console.log("User profile from SAML response:", req.user);
    // res.send(`welcome ${req.user.mail} ${req.user.givenname} ${req.user.sn}`);
    res.send(`welcome 
      mail: ${req.user.mail || ''}, 
      givenname: ${req.user.givenname || ''}, 
      sn: ${req.user.sn || ''}, 
      nameID: ${req.user.nameID || ''}, 
      nameId: ${req.user.nameId || ''}, 
      displayName: ${req.user.displayName || ''}, 
      uid: ${req.user.uid || ''},
      b2buidemail: ${req.user["b2buidemail"] || ''},
      OID givenname (2.5.4.42): ${req.user["urn:oid:2.5.4.42"] || ''},
      OID sn (2.5.4.4): ${req.user["urn:oid:2.5.4.4"] || ''},
      userPrincipalName: ${req.user["userPrincipalName"] || ''}
    `);
}
);

// app.post(
//     "/jhu/login/callback",
//     (req, res, next) => {
//       next();
//     },
//     passport.authenticate("samlStrategy",{
//         failureRedirect: "/login-failed",
//         failureFlash: "Authentication failed, please try again."
//     }),
//     (req, res) => {
//         console.log("User profile from SAML response:", req.user);
//         res.send(`welcome ${req.user.mail} ${req.user.givenname} ${req.user.sn}`);

//       // user login info
//       const userName = req.user.mail;
//       const firstName = req.user.givenname;
//       const lastName = req.user.sn;
//       const email = req.user.mail;
      
//       // check if user already in db
//       const query = "SELECT id FROM users WHERE Email = $1";
      
//       db.query(query, [email], (err, res)=>{
//         if (err) {
//             return res.status(500).json({ error: "Database query failed" });
//         }
//         if (res.rows.length==0){ // user not found : add the db 
//             const userId = uuidv4();

//             const addUserQuery = `
//             INSERT INTO users (id, Username, Lastname, Firstname, Email)
//             VALUES ($1, $2, $3, $4, $5)
//             RETURNING *; `;
//           db.query(addUserQuery, [userId, userName, lastName, firstName, email], (insertErr, insertResult) => {
//             if (insertErr) {
//               return res.status(500).json({ error: "Database insert failed" });
//             }

//             // Return the newly created user
//             res.status(201).json({token, user: insertResult.rows[0]});
//           });
//         }else{
//             // user in db 
//             const user = result.rows[0];
//             res.status(200).json({ token, user });
//         }
//       })
//     }
//   );


// trust between our app(SP) and idp (metadata XML)
app.get("/jhu/metadata", (req, res) => {
    res.type("application/xml");  // Set the response type as XML
    res.status(200);
    res.send(samlStrategy.generateServiceProviderMetadata(PbK, PbK));  // Pass the public key for signing
  });

app.get("/login-failed", (req, res) => {
const errorMessage = req.flash("error")[0] || "Authentication failed. Please try again.";
res.status(401).json({ error: errorMessage });
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ error: "Logout failed" });
      res.redirect("/jhu/login"); 
    });
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
    db.query("SELECT id, Username, Lastname, Firstname, Email, Password FROM users", (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(result.rows);
    });
});

// POST endpoint to create a new user
app.post("/users", (req, res) => {
    const { Username, Lastname, Firstname, Email, Password } = req.body;

    if (!Username || !Lastname || !Firstname || !Email || !Password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const userId = uuidv4();
    const query = `
        INSERT INTO users (id, Username, Lastname, Firstname, Email, Password)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    db.query(query, [userId, Username, Lastname, Firstname, Email, Password], (err, result) => {
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

  app.get('/created_tickets/:userId', async (req, res) =>{
    const{userId} = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(userId)) {
        return res.status(400).json({ error: "Invalid User ID format" });
    }
    console.log(userId);
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try{
        const checkUserQuery = "SELECT * FROM users WHERE id = $1";
        const userResult = await db.query(checkUserQuery, [userId]);
        if (userResult.rows.length != 1){
            return res.status(404).json({ error: "User not found" });
        }

        const getCreatedTicketNumberQuery = "SELECT COUNT(*) as created_tickets_count FROM ticket WHERE owner_id = $1";
        
        const result = await db.query(getCreatedTicketNumberQuery, [userId]);
        if (result.rows.length > 0) {
            const createdTickets = parseInt(result.rows[0].created_tickets_count, 10) || 0;
            console.log('Query result:', createdTickets);
            res.json({ created_tickets_count: createdTickets });
        } else {
            res.json({ created_tickets_count: 0 });
            // res.status(404).json({ error: "No tickets found for this user" });
        }
        
    }catch (error) {
        console.error("Error fetching ticket stats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/assigned_tickets/:userId', async (req, res) =>{
    const{userId} = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(userId)) {
        return res.status(400).json({ error: "Invalid User ID format" });
    }
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try{
        const checkUserQuery = "SELECT * FROM users WHERE id = $1";
        const userResult = await db.query(checkUserQuery, [userId]);
        if (userResult.rows.length != 1){
            return res.status(404).json({ error: "User not found" });
        }

        const getAssignedTicketNumberQuery = "SELECT COUNT(*) as assigned_tickets_count FROM ticket WHERE assigneduser_id = $1";
        
        const result = await db.query(getAssignedTicketNumberQuery, [userId]);
        if (result.rows.length > 0) {
            const assignedTickets = parseInt(result.rows[0].assigned_tickets_count, 10) || 0;
            console.log('Query result:', assignedTickets);
            res.json({ assigned_tickets_count: assignedTickets });
        } else {
            res.json({ assigned_tickets_count: 0 });
            // res.status(404).json({ error: "No tickets found for this user" });
        }
        
    }catch (error) {
        console.error("Error fetching ticket stats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/inprogress_tickets/:userId', async (req, res) =>{
    const{userId} = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(userId)) {
        return res.status(400).json({ error: "Invalid User ID format" });
    }
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try{
        const checkUserQuery = "SELECT * FROM users WHERE id = $1";
        const userResult = await db.query(checkUserQuery, [userId]);
        if (userResult.rows.length != 1){
            return res.status(404).json({ error: "User not found" });
        }

        const getInprogressTicketNumberQuery = "SELECT COUNT(*) as inprogress_tickets_count FROM ticket WHERE assigneduser_id = $1 AND status = 'InProgress'";
        
        const result = await db.query(getInprogressTicketNumberQuery, [userId]);
        if (result.rows.length > 0) {
            const inprogressTickets = parseInt(result.rows[0].inprogress_tickets_count, 10) || 0;
            console.log('Query result:', inprogressTickets);
            res.json({ inprogress_tickets_count: inprogressTickets });
        } else {
            res.json({ inprogress_tickets_count: 0 });
            // res.status(404).json({ error: "No tickets found for this user" });
        }
        
    }catch (error) {
        console.error("Error fetching ticket stats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get('/finished_tickets/:userId', async (req, res) =>{
    const{userId} = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(userId)) {
        return res.status(400).json({ error: "Invalid User ID format" });
    }
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try{
        const checkUserQuery = "SELECT * FROM users WHERE id = $1";
        const userResult = await db.query(checkUserQuery, [userId]);
        if (userResult.rows.length != 1){
            return res.status(404).json({ error: "User not found" });
        }

        const getFinishedTicketNumberQuery = "SELECT COUNT(*) as finished_tickets_count FROM ticket WHERE assigneduser_id = $1 AND (status = 'Done' OR status = 'Closed' )";
        
        const result = await db.query(getFinishedTicketNumberQuery, [userId]);
        if (result.rows.length > 0) {
            const finishedTickets = parseInt(result.rows[0].finished_tickets_count, 10) || 0;
            console.log('Query result:', finishedTickets);
            res.json({ finished_tickets_count: finishedTickets });
        } else {
            res.json({ finished_tickets_count: 0 });
            // res.status(404).json({ error: "No tickets found for this user" });
        }
        
    }catch (error) {
        console.error("Error fetching ticket stats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
  

  

  

  
  
// Home route
app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");  // sending back HTML
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

  

  
