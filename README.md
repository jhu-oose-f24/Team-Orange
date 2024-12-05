## Team-Orange

## Backend
Our backend api is running remotely at [https://chorehop-cc7c0bf7a12c.herokuapp.com](https://chorehop-cc7c0bf7a12c.herokuapp.com)

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

## Frontend
Our frontend can be accessed remotely from the host [https://team-orange-66uk.vercel.app/](https://team-orange-66uk.vercel.app/)

## App Features Currently Implemented

When you run our app currently you will load into a screen with a simple UI that says ChoreHop at the top. There is functionality in the app to create tickets as well as fetch tickets (GET and POST apis). Each time you load in, the tickets should be fetched and displayed, and then subsequently added tickets should be added to the feed. Title, description, category, and a date can be added to the ticket and will also be displayed on the tickets in the feed.

### Iteration 2

For this iteration we added a Navigation Bar, a Search Bar, functions to edit and delete tickets, profile and create tickets components, and styling for the entire app. Now, when you load into the app you are taken to our feed component which shows all of the tickets currently in our database. We have three different feeds now that are separated into Open, In Progress, and Done. We also have a search bar at the top of the three different feeds where you can search for a ticket by name or by date. Right now we have a search bar for each feed and it functions correctly for each feed. In the future we want to have just one search bar for all the feeds. In our create ticket component we separated out our create ticket functionality from our feed from the last iteration and gave it its own component and put it in the navigation bar. We added a payment and status field to the ticket interface. The payment can be input in the create ticket form as well as the status. When you create a ticket and specify the status it will show up in the correct feed. The status field is an enumeration with Open, In Progress, and Closed. In the profile component we hardcoded data in to show what the profile would look like; however, we have not yet implemented user authentication, so we do not have any data to implement into profile. We also put a feed component under the profile to show tickets that the user has created. We do not have the ability to filter that feed yet because we don't have users implemented. We also implemented the Ant Design Library into our app for a more appealing UI.

### Iteration 3

In iteration 3, we focused on our chat functionality, which also required the addition of users. We added devUsers that can be chosen from a dropdown menu, which assigns a UUID as the ownerID, allowing us to associate the owner and assigned users id's to each ticket. To change users, see the top of the screen on the nav bar where you select DevUser and choose your user from a dropdown. We then implemented the chat feature, with each ticket having an associated chat between the owner of the ticket and the assigned user. Currently, this is available for all tickets, but it will eventually only be available for those that are unclosed. This takes our application above a simple CRUD app, allowing for communication between the owner and assignee of each ticket. Additionally, we refined the search filter on both the backend and frontend. We altered the searchbar so that it only appears once on the primary page, searching through each of the three feeds. We also added the ability to filter tickets by category and minimum payment, improving the user experience on the front end.

Please note one minor bug for this iteration: When you assign yourself to a ticket during a user session, you need to update the page for the assign button to go away and the chat button to appear. We were focused on chat for this iteration so pushed this bug fix to it4, but it will be fixed shortly.

### Iteration 4

In iteration 4, we worked on setting up the remote hosts. We are hosting our backend using heroku and out frontend using vercel. Each can be accesses at the url's above. The backend can be accesses independently of the frontned on api interfaces such as Postman, and the frontend has been configured to update the remote database so that all users have one shared expirience. 

We also added many new features. First, we finished the ticket completion flow. An Open ticket can be "picked up" by any non-owner, which will automatically assign the ticket to the user who is logged in. This same (assigned) user can then chat with the owner through the chat feature from it3, and can also mark the ticket as "Done" when they are finished. Marking done will then automatically move the ticket into the Done feed. From the done feed, once the (assigned) user has been payed by the owner, through chat conversations, they can click "payment received" which will close out the ticket and remove it from all feeds. (Note: owners are always able to edit and delete tickets from any feed; assigned users can never edit or delete tickets. Non-owners and non-assigned users can never modify tickets which have already been assigned but can see them in the feed.) 

We also updated the Profile tab significantly. On the profile page, we created three feeds: The first feed shows all of the tickets you have created. The second feed shows all of the tickets you are currently working on or have picked up. The third feed shows all of the tickets you have completed but have not been paid for yet, and also on those tickets show a button allowing you to confirm payment once you have been paid. Additionally, we updated the name on the profile page to reflect the name of your current log in. Bio and avatar are currently static because we have not updated the database to handle these fields. We also updated the UI for create and edit ticket adding in a '+' icon at the bottom of the feeds page for better user expirience. Lastly, we implemented a new login feature when a user first visits the URL. They can login with their jhed, firstname, and lastname, which will store their session and allow them a personalized expirience over the entire app. If the user is not a current user, they will be automatically registered and logged in. 

Currently registed users include:

| jhed       |  lastname  | firstname   | email              | password |
|------------|------------|-------------| -------------------| -------- |
| "jyang231" |  "Yang"	  | "Jishuo"	  | "jyang231@jh.edu"  | 12345678 |
| "dwhitne5" |  "Whitney"	| "Dylan"	    | "dwhitne5@jhu.edu" | 12345678 |
| "jroloff1" |  "Roloff"	| "Jackson"	  | "jroloff1@jhu.edu" | 12345678 |
| "xwei40"	 |  "Wei"	    | "Xuemeng"	  | "xwei40@jh.edu"    | 12345678 |

and new users can me registed at any time!

Note: we have not created a logout feature yet. We also want to add an edit profile page where users can modify avatar and bio. These changes can be added in it5.

### Iteration 5
For iteration 5 we had focused on login and registration. We were able to successfully update our backend users table to include the necessary information we needed such as passwords for each user. From here we were able to improve our login functionality. The login screen now simply asks for a username and password. Appropriate error handling has been added for this such as invalid username or password. Additionally we now have the ability to register new users into the users table with a username, first name, last name, email, and password. Beyond this, we protected our app by ensuring only logged in user's can see profile pages, create tickets, and edit / pickup tickets. We had some trouble configuring the JHU SSO login, as we are still waiting for responses to our multiple emails. Before the portfolio and presentation, we are either going to hash our passwords and keep the login that we have right now or move forward with the JHU SSO login. 

We also made improvements to to the Profile page. Now a logged in user can view their completed tickets (which are tasks they own and have been fully completed) by clicking the view completed button. We also added a logout button on the Profile page which logs the user out and redirects them back to the login page. 

Additionally we made several improvements on styling. First, the ticket's themselves have much improved styling. The counts for completed and created tickets are not static anymore and show accurate numbers on the profile page. The avatar on the profile page is also no longer static and shows the users initials. Our ticket feeds have been improved as well, including flex improvements. 

## What we are building

Our plan is to build an app that allows users (specifically from within the Hopkins community) to sign on and do one of two things; First, users can create a ticket for any chore whether it be landscaping, cleaning, pickup, babysitting, etc. and other users on the app will be able to see what they are requesting. Second, these other users will have the ability to pick up these tickets, and complete the chore in exchange for pay. Basically, our app will be an all in one ticketing app for users in the JHU community to be able to request help with their chores and these users to be able to pick up jobs to make some quick money from helping out their fellow blue jays.
