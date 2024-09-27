# Running the Server

- Navigate to the project directory
cd [repository name]/backend/src
npm install

Once the dependencies are installed, you can start the server:
`node index.js`
The server will start on port 3000.

## Test the POST /tickets Endpoint (Add a new ticket):

In Postman, create a POST request to http://localhost:3000/tickets.
In the Body tab, select raw and then JSON as the format.
Add the following JSON payload:
{
  "title": "My First Ticket"
}

## Test the GET /tickets Endpoint (Retrieve all tickets):
Create a GET request to http://localhost:3000/tickets