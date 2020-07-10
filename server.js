//imports
const express = require("express");
const path = require("path");
const app = express();
const mysql = require('mysql');
const { create } = require("hbs");
const bodyParser = require('body-parser');
const session = require('express-session');

// other variables
const Error = "There has been an error we your request, please try again"

// setting up initial connection to the db
const db  = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    port: 3306,
    database: "user_registration_system"
});



//setting up path sets and use
const viewsPath = path.join(__dirname, '/views');
app.set('view engine', 'hbs');
app.set('views', viewsPath);
app.use(express.urlencoded());
app.use(express.json());

// connect to db
db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Successfully connected to user_registration_system database ');
    }
});



//index page render 
app.get("/", (req, res) => {
    res.render("index")    
});




// delete render
app.get("/deleting", (req, res) => {
    res.render("deleting")    
});




// landing page render
app.get("/landing", (req, res) => {
    res.render("landing")    
});




// registered page render
app.get("/registered", (req, res) => {
    res.render("registered")    
});


// registered page render
app.get("/update", (req, res) => {
    res.render("update")    
});



//the following code is only to test render to the database 

// app.get("/test", (req, res) => {

//     db.query('SELECT * FROM members', (error, results) => {
//         console.log(results);

//         res.render("test", {
//             members: results
//         })
//     })

// });


//getaway 
app.listen(3000, () => {
    console.log("Server is running on Port 3000");
})