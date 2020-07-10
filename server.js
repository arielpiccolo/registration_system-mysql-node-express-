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

// connect to db
db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Successfully connected to user_registration_system database ');
    }
});


//setting up path sets and use
const viewsPath = path.join(__dirname, '/views');
app.set('view engine', 'hbs');
app.set('views', viewsPath);
app.use(express.urlencoded());
app.use(express.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());




//index page render (GET)
app.get("/", (req, res) => {
    res.render("index")    
});

// index auth (POST)
app.post('/auth', (req, res) => {
	let email = req.body.email;
	var password = req.body.password;
	if (email && password) {
		db.query('SELECT * FROM members WHERE email = ? AND password = ?', [email, password], (error, results, fields) => {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.email = email;
                res.redirect('/landing');
			} else {
				res.send('<h1>Incorrect Username and/or Password, please try again</h1>');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
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