## What Went Well:

- Division of Labor: Each member of the team effectively contributed to the progress for it3 through FE/BE updates
- Communication: Communication and PR reviewes went smoothly. We reached out in slack when necessary and team members responded in timely manner.
- FE updates: we added many new FE updates to clean up the look of our app for a better UX such as owner/assigned user name, icons, error handling.
- profile updates: we finished the profile section to add a view completed tickets button (allows user to see tickets they owned which are now completed).
- Backend/DB improvements: we updates out backed DB, to add a password to the  the user table. We also added many new api endpoints for JHU SSO. 

## What Could be Improved:

- Login: users can currently log in with username and password. We have just recently received authorization for JHU SSO, so we are integrating it into the FE. 

## What Has Been Delivered:

- Ticket CRUD: We can now create, read, update, and delete tickets in the UI and store actions in the BE db
- Mutliple Ticket Feeds: We have multiple feeds based on if the ticket is Open, InProgress, or Done
- Routing: Routing to separate pages from the AppHeader to Feeds, Profile, and Create Ticket
- FE library updates: using antd for FE for consistent styling, many UX updates for overall clean look.
- Ticket search: users can search tickets on the */feed by name, date, etc. 
- Ticket assignment flow: users can pickup tickets to assign them to themselves
- Chatting: owners and assigned users can message each other for communication
- All ticket flow in */feed: tickets can now be created, viewed, edited, deleteed, and moved between all three statuses easily
- Profile: we made significant improvements to */profile. We now have mutliple feeds for tickets owned by that user, tickets that user is working on, and tickets that user has completed. 
- Login: we made a login page with username and password to store user credentials in local storage for different user sessions. 

## What We Have Not Yet Delivered:
 - finalized login (will be working by presentation)
