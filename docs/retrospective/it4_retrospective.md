## What Went Well:

- Division of Labor: Each member of the team effectively contributed to the progress for it3 through FE/BE updates
- Communication: Communication and PR reviewes went smoothly. We reached out in slack when necessary and team members responded in timely manner.
- Deployment of the app: a huge part of what we wanted to deliver in it4 was to remotely host the database and frontend. Both of these were completed as the backend is now hosted on heroku and the frontend on vercel.
- FE updates: we added many new FE updates to clean up the look of our app for a better UX
- profile updates: we made strides in the profile section so that now the user gains better insight into their owne tickets and tickets they work on.
- Backend/DB improvements: we updates out backed DB, specifically the user table, and added many new api endpoints for all the functionalities we needed
- BUGFIX: we fixed multiple bugs, as now we do not need to refresh the page to see tickets move between feeds and tickets with associated messages can be deleted.
- Error/success handling: we added new popups for error and successes for better UX.
- updated payment functionality: assignees can confirm when they have received a payent from the owner to move the ticket from Done to Closed. Other payment communication is done throught the chat feature. 

## What Could be Improved:

- Login: there were issues getting cleared to use JHU login. We have requested access and will have the ability to use the JHU login for it5.
- FE: cleaning frontend and ticket styling will be a focus for it5. 

## What Has Been Delivered:

- Ticket CRUD: We can now create, read, update, and delete tickets in the UI and store actions in the BE db
- Mutliple Ticket Feeds: We have multiple feeds based on if the ticket is Open, InProgress, or Done
- Routing: Routing to separate pages from the AppHeader to Feeds, Profile, and Create Ticket
- FE library updates: using antd for FE for consistent styling
- Ticket assignment flow: users can pickup tickets to assign them to themselves
- Chatting: owners and assigned users can message each other for communication
- All ticket flow in */feed: tickets can now be created, viewed, edited, deleteed, and moved between all three statuses easily
- Profile: we made significant improvements to */profile. We now have mutliple feeds for tickets owned by that user, tickets that user is working on, and tickets that user has completed. 
- (temp) login: we added a login page to replace the DevUser page. Now when users visit the base URL, they see the welcome page and can login or register. 

## What We Have Not Yet Delivered:

- JHU login: we will update the login page to use JHU SSO. 
