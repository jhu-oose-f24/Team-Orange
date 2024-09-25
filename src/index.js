import express from "express";
const app = express();
const port = 3000;
app.get("/", (req, res)=>{
    //res.send("Hello world");
    res.send("<h1>Hello world</h1>"); // sending back html 
})
app.listen(port, () =>{
    console.log(`Server started on port ${port} `);
})
