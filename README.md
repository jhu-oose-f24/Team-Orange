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

## Note:

backend/src/index.js and backend src/database.json must be modified with the credentials created locally:

`"driver": "pg",
"user": "postgres",
"password": "1234",
"host": "localhost",
"database": "TicketSystem" `

# Starting the Backend (If db already ran for Iteration1, no need to re-migrate)

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
https://chorehop-cc7c0bf7a12c.herokuapp.com/tickets

#Test Post
https://chorehop-cc7c0bf7a12c.herokuapp.com/tickets

{
  "title": "Test the server",
  "category": "maintenance",
  "description": "test01",
  "deadline": "2024-10-10 23:59:59",
  "owner_id": 1,
  "payment": 149
}

#Test Delete
https://chorehop-cc7c0bf7a12c.herokuapp.com/tickets/TICKET-ID

#Test Put
https://chorehop-cc7c0bf7a12c.herokuapp.com/tickets/TICKET-ID

{
    "title": "Fix the printer",
    "description": "The office printer needs to be repaired."
}
{
    "assigneduser_id": 3,
    "payment": 200
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

### Iteration 2

For this iteration we added a Navigation Bar, a Search Bar, functions to edit and delete tickets, profile and create tickets components, and styling for the entire app. Now, when you load into the app you are taken to our feed component which shows all of the tickets currently in our database. We have three different feeds now that are separated into Open, In Progress, and Done. We also have a search bar at the top of the three different feeds where you can search for a ticket by name or by date. Right now we have a search bar for each feed and it functions correctly for each feed. In the future we want to have just one search bar for all the feeds. In our create ticket component we separated out our create ticket functionality from our feed from the last iteration and gave it its own component and put it in the navigation bar. We added a payment and status field to the ticket interface. The payment can be input in the create ticket form as well as the status. When you create a ticket and specify the status it will show up in the correct feed. The status field is an enumeration with Open, In Progress, and Closed. In the profile component we hardcoded data in to show what the profile would look like; however, we have not yet implemented user authentication, so we do not have any data to implement into profile. We also put a feed component under the profile to show tickets that the user has created. We do not have the ability to filter that feed yet because we don't have users implemented. We also implemented the Ant Design Library into our app for a more appealing UI.

### Iteration 3

In iteration 3, we focused on our chat functionality, which also required the addition of users. We added devUsers that can be chosen from a dropdown menu, which assigns a UUID as the ownerID, allowing us to associate the owner and assigned users id's to each ticket. To change users, see the top of the screen on the nav bar where you select DevUser and choose your user from a dropdown. We then implemented the chat feature, with each ticket having an associated chat between the owner of the ticket and the assigned user. Currently, this is available for all tickets, but it will eventually only be available for those that are unclosed. This takes our application above a simple CRUD app, allowing for communication between the owner and assignee of each ticket. Additionally, we refined the search filter on both the backend and frontend. We altered the searchbar so that it only appears once on the primary page, searching through each of the three feeds. We also added the ability to filter tickets by category and minimum payment, improving the user experience on the front end.

Please note one minor bug for this iteration: When you assign yourself to a ticket during a user session, you need to update the page for the assign button to go away and the chat button to appear. We were focused on chat for this iteration so pushed this bug fix to it4, but it will be fixed shortly.

## What we are building

Our plan is to build an app that allows users (specifically from within the Hopkins community) to sign on and do one of two things; First, users can create a ticket for any chore whether it be landscaping, cleaning, pickup, babysitting, etc. and other users on the app will be able to see what they are requesting. Second, these other users will have the ability to pick up these tickets, and complete the chore in exchange for pay. Basically, our app will be an all in one ticketing app for users in the JHU community to be able to request help with their chores and these users to be able to pick up jobs to make some quick money from helping out their fellow blue jays.
