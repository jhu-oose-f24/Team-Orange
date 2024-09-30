# Team-Orange

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
# Starting the Frontend
```
Navigate to the frontend directory
npm install
npm start 
Click the link printed in the console or go to http://localhost:3001 to start adding tickets!
```