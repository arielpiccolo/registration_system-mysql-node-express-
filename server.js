//? =========================================== IMPORTS ===========================================================================
const express = require("express");
const path = require("path");
const app = express();
const mysql = require('mysql');
const { create } = require("hbs");
const bodyParser = require('body-parser');
const session = require('express-session');
const hbs = require('hbs');
const { get } = require("http");
const { query } = require("express");
// const alert = require('alert-node')

// other variables
const Error = "There has been an error we your request, please try again"
// ? ==================================================================================================================================



//? ========================================== PATHS, SETS AND USES ==============================================================
const viewsPath = path.join(__dirname, './views');
const partialPath = path.join(__dirname, './views/inc');

hbs.registerPartials(partialPath);

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
                {name: Name, email: Email, pass: Password}, (error,results) => {
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
app.get("/goAdmin", (req, res) => {

    db.query('SELECT * FROM members', (error, results) => {
        console.log(results);
        res.render("admin", {
            members: results
        })
    })
  
});
// ? =====================================================================================================================================


// ?=============================================DELETING RECORDS===============================================================
// delete render
app.get("/del", (req, res) => {
    res.render("deleting")    
});

app.post("/delRecord", (req, res) => {
    let deleteEmail = req.body.emailRecord;
    let sqlCall = "DELETE  FROM members where email = ?"
    let locate = req.params.email; //! check if this is actually doing anything
    let user = [deleteEmail, locate];

    db.query( sqlCall, user, (error, results) => {
        if(error) {
            console.log(error);
            res.render("deleting", {
                message: "There was an error updating your user"
            })
        } else {
            res.render("deleting", {
                message: "User deleted"
            })
        }
    })

});
// ? ============================================================================================================================

// ? ===============================================Members landing page ======================================================
// landing page render
app.get("/landing", (req, res) => {
    res.render("landing")    
});
// ? ============================================================================================================================


// ? ============================================== UPDATE PAGE =================================================================
app.get("/up", (req, res) => {
    db.query('SELECT * FROM members', (error, results) => {
        res.render("update", {
            members: results
        })
    })
});

app.post("/upRecord", (req, res) => {
    let updateByEmail = req.body.updateMember;
    let sqlUpdateCall = 'SELECT * FROM members where email = ?'
    let memberEmail = [updateByEmail];

    db.query( sqlUpdateCall, memberEmail,  (error, results) => {
            if(error) {
                console.log(error);
                res.render("update", {
                    message: "There was an error updating your user"
                })
            } else {
                console.log(results);
                res.render('updating', {
                    details: "You selected " + memberEmail + " to be updated "
            })
            



            app.get("/nameSelected", (req, res) => {
                res.render("successUpdating")
            })

    

            app.post("/nameSelected", (req, res) => {
                let NewName = [];
                NewName = (req.body.Name);
                let Pass = [];
                Pass = (req.body.Password);
                let recordPassSqlCall = ('select password from members where email = ?');    
                // db.query('SELECT password from members where email = ?',['admin@email.com'] 
                                             

                db.query(recordPassSqlCall, updateByEmail, (error, results) => {


                if( error ) {
                    res.send(Error)
                
                } else {
                    res.send(results)
                }
                
                });


                // db.query('SELECT name FROM members WHERE email = ?',
                // [memberEmail], (error, results) => {
                //     if( error ) {
                //         console.log('record not found')
                //         res.render('successUpdating', {
                //             error: "Sorry Record not found"
                //         })
                //     } else {
                //         // console.log(NewName);
                //         // console.log(Pass);

                        
                //     }
                // })
            })







            app.post("/emailSelected", (req, res) => {
                
            })
            
            app.post("/passwordSelected", (req, res) => {
                
            })
            

        };

    })

});



// ? =========================================================================================================================






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


// ? ===================================================================================================================================

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! getaway -> leave alone!
app.listen(3000, () => {
    console.log("Server is running on Port 3000");
})
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// ?========================================================END=========================================================================
