Team Orange - Brian, Jackson, Matthew, Dylan, John, Xuemeng
Design: Is the code well-designed and appropriate for your system? Think of all design principles and patterns that you've studied in this course. You may need to refactor the code.
- The FE repo is well structured into multiple subfolders. We have a api folder for all FE api requests, components folder for all react components, types folder for relevant types, with App.tsx in the /src folder. This way it is easy to find files based on their functionalities.
- The BE repo is similarly well structured. We have a certs folder for login functionalities, and our BE index.js has requests ordered by endpoint.
- The DB is well designed. The schema uses UUIDs as primary keys, which ensures uniqueness across distributed systems. ENUM types including category, status, and priority are used for constrained, well-defined fields.

Complexity: Could the code be made simpler? Would another developer be able to easily understand and use this code when they come across it in the future?
- Yes, the FE code is split up so that each file is responsible for just one component/functionality.
  The BE code also has all relevant endpoints well documented.
  The DB schema is relatively simple and easy to follow.
  Tests: Does the code have correct and well-designed automated tests?
- Many of our postman tests are included in this workspace:
  https://app.getpostman.com/join-team?invite_code=a075671c5f6f313bf322bd41706087d1
  These tests were updated/changed throughout the development process, such as switching request types (GET, POST, PUT, DELETE) and JSON bodies to verify the expected responses from the BE server
  We also extensively tested the FE app manually. We verified that when users create a new ticket, the ticket shows up the the correct feed as unassigned. We ensured the correct flow for picking up a ticket (when it moves to the InProgress feed and becomes assigned), the flow for marking as Done (when the assigned user marks as done it moves to the Done feed) then when payment is confirmed the ticket moves to the owners Completed tickets feed.  
  Similarly we ensured that the Profile page represents the correct tickets for each feed. My Created tickets are all the tickets where the signed in user is the owner, My Tasks are all tickets currently assigned to the logged in user, Awaiting Payment are all tickets that the signed in user has marked as done but have not received payment from the owner yet. Completed tickets are all tickets that the signed in user owns and have been completed with payment verified from the assignee.
  We also tested the search functionality manually and saw that the tickets filter as expected.

Naming: Did the developer choose clear names for variables, classes, methods, etc.?
- Our variables, classes, and methods are all appropriately named providing information about what each part does. For example, our components are all named to represent what each component is (such as Ticket.tsx, Feed.tsx)
- Our endpoints are also appropriately named, providing information about what each call does. For example, we have a /tickets endpoint that supports creation, deletion, editing, and retrieval of our tickets.
- No improvements were needed for this section.
- The DB table and column names are clear and meaningful.


Comments: Are the comments clear and useful?
- We added comments for both frontend and backend functions, including functions for index.js, frontend interface and how api works in the project. All of them are precise, clean and helpful to understand the interact and structure between frontend and backend.
- No comments are provided in the SQL scripts.


Style: Does the code follow good programming practices?
- There were occasional imports that were not used in FE components, these were removed when not needed.
  We ran prettier on the entire repo once everyone's code was pushed/merged.
  Removed console.log()
- For DB, The use of IF NOT EXISTS and DEFAULT values reflects good practices.
  Documentation: Is there a documentation on how to install and run the application?
  Our frontend can be accessed remotely from the host https://team-orange-66uk.vercel.app/
  Our backend api is running remotely at https://chorehop-cc7c0bf7a12c.herokuapp.com
  There should be no need to run the project locally.
  Should one want to, steps can be found here: https://github.com/jhu-oose-f24/Team-Orange/blob/main/docs/run_local_steps.md
  (in Team-Orange/docs repo)

Contributions to code review process:
- Jackson: deleted unused imports and console logs, wrote testing review section on Postman calls and how we test manually, ran prettier for styling. Reviewed code structure.
- Brian: wrote comments for frontend files and evaluated code design
- John: wrote comments for frontend files and inspected code structure
- Rayna: wrote comments for backend files and described it in write-up
- Dylan: wrote comments for frontend files and examined naming
- Matthew: evaluated code complexity and helped with write-up