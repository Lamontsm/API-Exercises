// Copied code from node + MySQL demo on YouTube
// Priors are v#demoDB.js
//  https://www.youtube.com/watch?v=YYEC7ydDj4k
// REST for CRUD
// V2 is taking it further to passing parameters in URLs
// Now to add interaction with web pages using express

const express = require('express')
const mysql = require('mysql')
const app = express();

// app.set('view engine', 'ejs');

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'steve',  // cannot grant root access now
    password: 'Bruno75BigBoobs'
    // database: 'Books'
})

// Connect to MySQL
db.connect((err) => {
    if(err) {
        throw err
    }
    console.log('MySQL connected')
});

//READ Request Handlers
app.get('/', (req, res) => {
    // res.send('<h1>Welcome to Steve Lamonts book demo</h1>');
    res.render('index');
});

// Create Database - not needed if created at command line
// app.get("/createdb", (req, res) => {
//     let sql = "CREATE DATABASE testing";
//     console.log("it should be created");
//     db.query(sql, (err) => {
//         if (err) {
//             throw err;
//         }
//         res.send("Database Created")
//     });
// });

// Create Table - not needed if created at command line
// app.get('/createbooks', (res, req) => {
//     let sql = 'CREATE TABLE Books(Title VARCHAR(255), Author VARCHAR(255), Index_Value INT, PRIMARY KEY (Index_Value))' 
//         db.query(sql, err =>)
//             if(err) {
//                 throw err
//             }
//             res.send('Books tabel created')
//     })
// })

// Insert book
app.get('/newbook', (req,res) => {
    let post = {Title: 'Lord of the Rings', Author: 'Goldman', Index_value: 5}
    let sql = 'INSERT INTO Books SET ?'
    let query = db.query(sql, post, err => {
        if(err) {
            throw err
        }
        res.send('Book added')
    })
})

// Insert book from URL parameters -- my new stuff
app.get('/addbook', (req,res) => {
    const newTitle = req.query.title;
    const newAuthor = req.query.author;
    //res.send(newTitle + " added");

    let post = {Title: newTitle, Author: newAuthor, Index_value: 55};
    let sql = 'INSERT INTO Books SET ?'
    let query = db.query(sql, post, err => {
        if(err) {
            throw err
        }
        res.send('Book added')
    })
})

// Select Books
app.get('/getbooks', (req, res) => {
    let sql = 'SELECT * FROM Books'
    let query = db.query(sql, (err, results) => {
        if(err) {
            throw err
        }
        // console.log(results[0].Title);
        // res.send('Books details fetched')
        res.render('booklist', {books: results});
    })
})

// Select a particular book by id number
app.get('/getbook', (req, res) => {
    const recordNum = req.query.recordnum;
    let returnComment = '';
    // Check to see if the book exists
    let sql = 'SELECT COUNT(id) AS total FROM Books WHERE id = ' + recordNum;
    let query = db.query(sql, (err, result) => {
        if(err) {
            throw err
        }
        let isMissing = (result[0].total === 0);
        if (isMissing) {
            res.send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
        }
        // Fetch the book
        else {
            let sql = 'SELECT * FROM Books WHERE id = ' + recordNum;
            let query = db.query(sql, (err, results) => {
                if(err) {
                    throw err
                }
                res.send(results);
                returnComment += results;
            })
        }
    })
})

// Update a book
app.get('/updatebook/', (req, res) => {
    const recordNum = req.query.recordnum;
    const newTitle = req.query.title;
    const newAuth = req.query.auth;
    let returnComment = '';
     // Make sure the book is in the collection
    let sql = 'SELECT COUNT(id) AS total FROM Books WHERE id = ' + recordNum;
    let query = db.query(sql, (err, result) => {
        if(err) {
            throw err
        }
        let isMissing = (result[0].total === 0);
        if (isMissing) {
            returnComment = '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>';
        }
        // Make the changes to either Title, Author, or both
        else {
            if (newTitle != "") {
                let sql = 'UPDATE Books SET Title = "' + newTitle + '" WHERE id = ' + recordNum;
                returnComment = returnComment + ' Updated title to ' + newTitle;
                let query = db.query(sql, err => {
                    if (err) {
                        throw err
                    }
                })
            }
            if (newAuth != '') {
                let sql = 'UPDATE Books SET Author = "' + newAuth + '" WHERE id = ' + recordNum;
                returnComment = returnComment + ' Updated Author to ' + newAuth;
                let query = db.query(sql, err => {
                    if (err) {
                        throw err
                    }
                })
            }
        res.send('this is what I send back ' + returnComment);
        }
    })
})

// Delete book
app.get('/deletebook/:id', (req, res) => {
    // Make sure the book is in the collection
    let recordNum = req.params.id;
    let isMissing;
    let sql = 'SELECT COUNT(id) AS total FROM Books WHERE id = ' + recordNum;
    let query = db.query(sql, (err, result) => {
        if(err) {
            throw err
        }
        isMissing = (result[0].total === 0);

        // Remove book if it exists. Otherwise return an error message. 
        if (isMissing){
            res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
        }
        else {
            let sql = "DELETE FROM Books WHERE id = " + recordNum;
            let query = db.query(sql, err => {
                if (err) {
                    throw err
                }
                res.send('Book deleted from index: ' + recordNum);
            })
        }
    })
    
})

const port=3000;
app.listen(port, () => {
    console.log('Server started on port', port)
});