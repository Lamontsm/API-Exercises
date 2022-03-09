// Copied code from node + MySQL demo on YouTube
//  https://www.youtube.com/watch?v=YYEC7ydDj4k
// REST for CRUD

const express = require('express')
const mysql = require('mysql')
const app = express();

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bruno75BigBoobs',
    database: 'Books'
})

// Connect to MySQL
db.connect(err => {
    if(err) {
        throw err
    }
    console.log('MySQL connected')
});

//READ Request Handlers
app.get('/', (req, res) => {
    res.send('Welcome to Steve Lamonts book demo');
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

// Select Books
app.get('/getbooks', (req, res) => {
    let sql = 'SELECT * FROM Books'
    let query = db.query(sql, (err, results) => {
        if(err) {
            throw err
        }
        console.log(results)
        res.send('Books details fetched')
    })
})

// Update book
app.get('/updatebook/:id', (req, res) => {
    let newBook = "Holy Bible";
    let book = parseInt(req.params.id);
    let sql = "UPDATE Books SET Title = '" + newBook + "' WHERE Index_value =" + book;
    let query = db.query(sql, err => {
        if(err) {
            throw err
        }
        res.send('Book updated')
    })
})

// Delete book
app.get('/deletebook/:id', (req, res) => {
    let sql = "DELETE FROM Books WHERE Index_value = req.params['id'}"
    let query = db.query(sql, err => {
        if (err) {
            throw err
        }
        res.send('Book deleted')
    })
})

const port=3000;
app.listen(port, () => {
    console.log('Server started on port', port)
})