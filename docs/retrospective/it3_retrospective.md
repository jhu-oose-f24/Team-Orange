## What Went Well:

- Solving users requirement: the big feature we wanted to build out this iteration was the chat feature between the ower and the assigned user for a ticket. To accomplish this, we needed to be able to have different users in the app. However, we did not have a login functionality yet. Therefore, we decided to create a temporaty devUser feature where we could simulate a logged in session. This quick fix allowed us to build out chat now like we wanted without requiring a finished login.
- Chat feature: the chat feature works well and adds capabilities beyond CRUD to out app.
- Division of Labor: Each member of the team effectively contributed to the progress for it3 through FE/BE updates
- Communication: Communication and PR reviewes went smoothly. We reached out in slack when necessary and team members responded in timely manner.
- Delivered on what we planned for it3: All of out P0 tasks in the board were completed for it3 on time.

## What Could be Improved:

- Error/success handling in UI: We want to use toast for error/success handling so that users know when their acctions were successful and when they encounter issues. Some error/success handling is present in the UI already, but error/success messages are permanent as they are conditionally rendered as divs in the Feed. We want to use toast alerts in the future.
- Separating components: Some components such as editing and deleting are still in Ticket.tsx. These will be separated out into their own components.
- Pickup Ticket Bug: when a user picks up a ticket, the pickup Ticket button is not automatically hidden. If the page is refreshed, it will be hidden, but we will want to fix this bug in the future.

## What Has Been Delivered:

- Ticket CRUD: We can now create, read, update, and delete tickets in the UI and store actions in the BE db
- Mutliple Ticket Feeds: We have multiple feeds based on if the ticket is Open, InProgress, or Done
- Routing: Routing to separate pages from the AppHeader to Feeds, Profile, and Create Ticket
- FE library updates: using antd for FE for consistent styling
- Ticket assignment flow: users can pickup tickets to assign them to themselves
- Chatting: owners and assigned users can message each other for communication

## What We Have Not Yet Delivered:

- User login, storing JSWebToken for sessions
- finished Profile view
- FE usability updates (confirm popovers, toast error/success messages)
- Host the database remotely
- Payment Functionality (brainstorming how we want to implement, could store balance for each user in the db, deposit funds and update balance on completion of tickets. Could also be a verification status based on a third party payment system - venmo, zelle, etc)
