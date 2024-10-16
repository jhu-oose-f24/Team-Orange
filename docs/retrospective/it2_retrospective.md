## What Went Well:

- Integrating antd: We integrated the antd fe library into the UI which elevated usability and cleanliness
- Division of Labor: Each member of the team effectively contributed to the progress for it2 through FE/BE updates
- Communication: Communication and PR reviewes went smoothly. We reached out in slack when necessary and team members responded in timely manner.
- Delivered on what we planned for it2: All of out P0 tasks in the board were completed for it2 on time.

## What Could be Improved:

- Error/success handling in UI: We want to use toast for error/success handling so that users know when their acctions were successful and when they encounter issues. Some error/success handling is present in the UI already, but error/success messages are permanent as they are conditionally rendered as divs in the Feed. We want to use toast alerts in the future.
- Separating components: Some components such as editing and deleting are still in Ticket.tsx. These will be separated out into their own components.

## What Has Been Delivered:

- Ticket CRUD: We can now create, read, update, and delete tickets in the UI and store actions in the BE db
- Mutliple Ticket Feeds: We have multiple feeds based on if the ticket is Open, InProgress, or Done
- Routing: Routing to separate pages from the AppHeader to Feeds, Profile, and Create Ticket
- FE library updates: using antd for FE for consistent styling

## What We Have Not Yet Delivered:

- User login, storing JSWebToken for sessions
- myTickets FE view (in progress might be in the profile section)
- FE usability updates (confirm popovers, toast error/success messages)
- Host the database remotely
- Payment Functionality (brainstorming how we want to implement, could store balance for each user in the db, deposit funds and update balance on completion of tickets. Could also be a verification status based on a third party payment system - venmo, zelle, etc)
