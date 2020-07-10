//imports
const express = require("express");
const path = require("path");
const app = express();
const mysql = require('mysql');

//setting up path sets and use
const viewsPath = path.join(__dirname, '/views');
app.set('view engine', 'hbs');
app.set('views', viewsPath);
app.use(express.urlencoded());
app.use(express.json());

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





//getaway 
app.listen(3000, () => {
    console.log("Server is running on Port 3000");
})