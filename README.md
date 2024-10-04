# Team-Orange

# Setting Up the PostgreSQL Database

Install PostgreSQL using your preferred package manager. On macOS, you can install it with Homebrew:
```
brew install postgresql
brew services start postgresql
```
For other operating systems, follow the instructions on the official PostgreSQL website.

Open a psql session to create a new PostgreSQL user and database.
Run the following commands to create a new user (replace your_username with your preferred username) and set a password for the user:
```
psql postgres
CREATE USER your_username WITH SUPERUSER CREATEDB CREATEROLE PASSWORD 'your_password';
CREATE DATABASE your_db_name OWNER your_username;
```
Exit psql by typing \q.

Open the project’s backend/src/database.json file and update the database connection details. 

Navigate to the backend/src directory and install the required database migration tools:
```
npm install -g db-migrate
npm install -g db-migrate-pg
```
Run the database migrations to initialize the database:
```
db-migrate up initialize
```
Your PostgreSQL database is now set up and ready to be used with the backend of the project.

# Starting the Backend

Start Database
```
Navigate to the backend/src directory 
npm install -g db-migrate
npm install -g db-migrate-pg
npx db-migrate up initialize
```

Run Backend
```
Navigate to the backend/src directory
npm install
node index.js
```

Testing Backend
```
#Test Get
http://localhost:3000/tickets

#Test Post
http://localhost:3000/tickets

{
  "title": "Test the server",
  "category": "maintenance",
  "description": "test01",
  "deadline": "2024-10-10 23:59:59",
  "owner_id": 1
}
```
Note: if you restart the database, you must also restart the backend server to regain getting and posting functionality.
## Starting the Frontend (Separate terminal)
```
Navigate to the frontend directory
npm install
npm start 
Click the link printed in the console or go to http://localhost:3001 to start adding tickets!
```

## App Features Currently Implemented
When you run our app currently you will load into a screen with a simple UI that says ChoreHop at the top. There is functionality in the app to create tickets as well as fetch tickets (GET and POST apis). Each time you load in, the tickets should be fetched and displayed, and then subsequently added tickets should be added to the feed. Title, description, category, and a date can be added to the ticket and will also be displayed on the tickets in the feed. 

## What we are building
Our plan is to build an app that allows users (specifically from within the Hopkins community) to sign on and do one of two things; First, users can create a ticket for any chore whether it be landscaping, cleaning, pickup, babysitting, etc. and other users on the app will be able to see what they are requesting. Second, these other users will have the ability to pick up these tickets, and complete the chore in exchange for pay. Basically, our app will be an all in one ticketing app for users in the JHU community to be able to request help with their chores and these users to be able to pick up jobs to make some quick money from helping out their fellow bluejays.