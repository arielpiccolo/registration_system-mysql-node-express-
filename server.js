//? =========================================== IMPORTS ===========================================================================
const express = require("express");
const path = require("path");
const app = express();
const mysql = require('mysql');
const { create } = require("hbs");
const bodyParser = require('body-parser');
const session = require('express-session');
const hbs = require('hbs');

// other variables
const Error = "There has been an error we your request, please try again"
// ? ==================================================================================================================================



//? ========================================== PATHS, SETS AND USES ==============================================================
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
// ? ===============================================================================================================================




// ? ================================================ DB CONNECTION =================================================================
const db  = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    port: 3306,
    database: "user_registration_system"
});

db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Successfully connected to user_registration_system database ');
    }
});
//?===========================================================================================================================




//?====================================================INDEX RENDER(GET AND POST)=============================================
app.get("/", (req, res) => {
    res.render("index")    
});


// index auth (POST) for login
app.post('/auth', (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	if (email && password) {
		db.query('SELECT * FROM members WHERE email = ? AND password = ?', [email, password], (error, results) => {
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

//!  button in index to register page DO NOT REMOVE!
//!++++++++++++++++++++++++++++++++++++++++++++++++
app.post("/goReg", (req, res) => {
    res.redirect("register")
})
//!++++++++++++++++++++++++++++++++++++++++++++++++
// ? ===============================================================================================================================



//?===================================================REGISTER RENDER (GET AND POST)================================================
app.get("/register", (req, res) => {
    res.render("register")
});

app.post("/register", (req, res) => {
    let Name = req.body.regName;
    let Email = req.body.regEmail;
    let Password = req.body.regPassword;
        
        db.query('SELECT email FROM members WHERE email= ?',
        [Email], (error, results) => {
            if( results.length > 0 ) {
                res.render("register", {
                    data: "Sorry user taken"
                })
            } else {
                db.query('INSERT INTO members SET ?',
                {name: Name, email: Email, password: Password}, (error,results) => {
                    if (error) {
                        res.render("register", {
                            data: "Sorry there has been an error"
                        })
                    } else {
                        res.render("register", {
                            data: "User registered"
                        })
                    }
                })
            }
              
        })  

}) ;

// ? ====================================================================================================================================


// ? ===============================================ADMIN PAGE=========================================================================
app.get("/admin", (req, res) => {

    db.query('SELECT * FROM members', (error, results) => {
        console.log(results);

        res.render("admin", {
            members: results
        })
    })

});
// ? =====================================================================================================================================



// delete render
app.get("/deleting", (req, res) => {
    res.render("deleting")    
});

// landing page render
app.get("/landing", (req, res) => {
    res.render("landing")    
});


// registered page render
app.get("/update", (req, res) => {
    res.render("update")    
});



// ? =========================the following code is only to test render to the database ================================================= 
//!+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ for testing access to database DO NOT TOUCH!
app.get("/test", (req, res) => {

    db.query('SELECT * FROM members', (error, results) => {
        console.log(results);

        res.render("test", {
            members: results
        })
    })

});
//!+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ? ======================================================================================================================================





//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! getaway -> leave alone!
app.listen(3000, () => {
    console.log("Server is running on Port 3000");
})
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!









// ?========================================================END=========================================================================









// ! SOME BACKUP BELLOW

// index register(POST) for register
// app.post("/reg", (req, res) => {
//     let regEmail = req.body.regEmail;
//     let regPassword = req.body.regPassword;
//     let regName = req.body.regName;
//     if (regName && regEmail && regPassword) {
//         db.query('SELECT * FROM member WHERE name = ? AND email = ? AND password = ?', [regName, regEmail, regPassword], (error, results) => {
//             if (results.length > 0) {
//                 req.render("/registered", {
//                     message: "Sorry that user has already been taken"
//                 })
//             } else {
//                 db.query('INSERT INTO members SET ?',
//                 {name: regName, email: regEmail, password: regPassword}, (error, results) => {
//                     if (error) {
//                         res.render("/registered", {
//                             message: "sorry there has been an error, try again"
//                         })
//                     } else {
//                         res.render("register",{
//                             message: "User successfully registered"
//                         })
//                     }
//                 }

//                 )
//             }
//         })
//     }
// })