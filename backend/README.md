
# Start DB
```
# go to backend->src
npm install -g db-migrate
npm install -g db-migrate-pg
db-migrate up initialize
```

# Run BE
```
go to backend/src
npm install
node index.js
```

# To Test
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