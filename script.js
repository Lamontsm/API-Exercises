// Copied code from node + MySQL demo on YouTube
// Priors are v#demoDB.js
//  https://www.youtube.com/watch?v=YYEC7ydDj4k
// REST for CRUD
// V2 is taking it further to passing parameters in URLs
// Now to add interaction with web pages using express

const express = require('express');
const mysql = require('mysql');
const app = express();
const mongo = require('mongodb');

import $ from 'jquery';  // It does not like this
window.jQuery = window.$ = $;
$(selector).hide();

// serve your css as static
app.use(express.static(__dirname));

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: 'Bruno75mysql#',
    database: 'books'
})

// Connect to MySQL
db.connect((err) => {
    if(err) {
        throw err
    }
    console.log('MySQL connected');
});

// Create MongoDB database
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/Stevedb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("MongoDB Stevedb database created!");
  db.close();
});

// Create MongoDB collection "changelog"
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  let dbo = db.db("Stevedb");
  dbo.createCollection("changelog", function(err, res) {
    if (err) throw err;
    console.log("Collection changelog created!");
    db.close();
  });
});

//READ Request Handlers
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/HTML/index.html");
});

// Create MySQL Database - not needed if created at command line
app.get("/createdb", (req, res) => {
    let sql = "CREATE DATABASE Books";
    console.log("it should be created");
    db.query(sql, (err) => {
        if (err) {
            throw err;
        }
        res.send("Database Created")
    });
});

// Create Table - not needed if created at command line
app.get('/createbooks', (res, req) => {
    let sql = 'CREATE TABLE books(Index_Value int AUTO_INCREMENT, Title VARCHAR(255), Author VARCHAR(255), PRIMARY KEY (Index_Value))' 
        db.query(sql, (err, result) => {
            if(err) {
                throw err
            }
            res.send('Books table created');
            console.log(result);
    })
})

// Insert preset book
app.get('/newbook', (req,res) => {
    let post = {Title: 'Lord of the Rings', Author: 'Goldman'};
    let sql = 'INSERT INTO books SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err) {
            throw err
        }
        res.send('Book added');
        console.log(result);
    })
})

// Insert book from URL parameters -- my new stuff
app.get('/addbook', (req,res) => {
    const newTitle = req.query.title;
    const newAuthor = req.query.author;

    let post = {Title: newTitle, Author: newAuthor};
    let sql = 'INSERT INTO books SET ?'
    let query = db.query(sql, post, (err, result) => {
        if(err) {
            throw err
        }
        res.send(newTitle + ' Book added')
    })
    let logEntry = {action:'Add book', title:newTitle, author:newAuthor};
    updateLog(logEntry);
})

// Select Books
app.get('/getbooks', (req, res) => {
    res.sendFile(__dirname + "/HTML/getbooks.html");
    let sql = 'SELECT * FROM books';
    let query = db.query(sql, (err, results) => {
        if(err) {
            throw err
        }

        for (let i=0; i<results.length; i++){
            let titleRow = JSON.stringify(results[i].Title);
            let authorRow = JSON.stringify(results[i].Author);
            let indexRow = JSON.stringify(results[i].Index_Value);
            $('booktable').append("<tr><td>${titleRow}</td><td>${authorRow}</td><td>${indexRow}</td></tr>");  //JQuery not working here
 
            // outString += '<tr><td>' + JSON.stringify(results[i].Title) + '</td><td>';
            // outString += JSON.stringify(results[i].Author) + '</td><td>';
            // outString += JSON.stringify(results[i].Index_Value) + '</td></tr>';
            // $(document).ready(function (){
            //     $(".add-row").function () {  // TODO This needs a function. Check documentation of Jquery
            //         let outString = '<tr><td>' + JSON.stringify(results[i].Title) + '</td><td>';
            //         outString += JSON.stringify(results[i].Author) + '</td><td>';
            //         outString += JSON.stringify(results[i].Index_Value) + '</td></tr>';
            //         tableBody = $('table tbody');
            //         tableBody.append(outString);
            //     }
            // }
        };
        // outString += '</table>';
        // res.status(200).send(outString); Cannot have 2 sends
    })
})


// Select a particular book by id number
app.get('/getbook', (req, res) => {
    const recordNum = req.query.recordnum;
    let returnComment = '';
    // Check to see if the book exists
    let logEntry = {location:recordNum, action: 'get book'};;
    let sql = 'SELECT COUNT(Index_Value) AS total FROM books WHERE Index_Value = ' + recordNum;
    let query = db.query(sql, (err, result) => {
        if(err) {
            throw err
        }
        let isMissing = (result[0].total === 0);
        if (isMissing) {
            res.send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
            logEntry.status = 'not found';
        }
        // Fetch the book
        else {
            let sql = 'SELECT * FROM books WHERE Index_Value = ' + recordNum;
            let query = db.query(sql, (err, results) => {
                if(err) {
                    throw err
                }
                res.send(results);
                returnComment += results;
                logEntry.status = 'found';
            })
        }
        updateLog(logEntry);
    })
})

// Update a book  
app.get('/updatebook', (req, res) => {
    const recordNum = req.query.recordnum;
    const newTitle = req.query.title;
    const newAuth = req.query.auth;
    let returnComment = '';
    let logEntry = {action:'Update Book', location:recordNum, title:newTitle, author:newAuth};
     // Make sure the book is in the collection
    let sql = 'SELECT count(*) FROM books WHERE Index_Value =' + recordNum;
    let query = db.query(sql, (err, result) => {
        if(err) {
            throw err
        }
        let isMissing = (result[0]['count(*)'] == 0);
        if (isMissing) {
            returnComment = '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>';
            logEntry.status = 'missing';
        }
        // Make the changes to either Title, Author, or both
        else {
            if (newTitle != "") {
                let sql = 'UPDATE books SET Title = "' + newTitle + '" WHERE Index_Value = ' + recordNum;
                returnComment = returnComment + ' Updated title to ' + newTitle + '.';
                logEntry.status = 'success';
                let query = db.query(sql, err => {
                    if (err) {
                        throw err
                    }
                })
            }
            if (newAuth != '') {
                let sql = 'UPDATE books SET Author ="' + newAuth + '" WHERE Index_Value = ' + recordNum;
                returnComment = returnComment + ' Updated Author to ' + newAuth + '. ';
                logEntry.status = 'success';
                let query = db.query(sql, err => {
                    if (err) {
                        throw err
                    }
                })
            }
        }
    })
    res.send(returnComment);
    updateLog(logEntry);
    
})

// Delete book
app.get('/deletebook/', (req, res) => {
    // Make sure the book is in the collection
    let recordNum = req.query.id;
    let total;
    let isMissing;
    let logEntry = {action: 'delete book', location: recordNum};
    let sql = 'SELECT count(*) FROM books WHERE Index_Value=' + recordNum;
    let query = db.query(sql, (err, result) => {
        if(err) {
            throw err
        }
        isMissing = (result[0]['count(*)'] == 0);

        // Remove book if it exists. Otherwise return an error message. 
        if (isMissing){
            res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
            console.log('could not find book ', recordNum);
            logEntry.status = 'not found';
        }
        else {
            let sql = "DELETE FROM books WHERE Index_Value = " + recordNum;
            let query = db.query(sql, err => {
                if (err) {
                    throw err
                }
                res.send('Book deleted from index: ' + recordNum);
                logEntry.status = 'success';
            })
        }
    })
    updateLog(logEntry);
})
// Function to update logbook in MongoDB
updateLog = function (entry){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Stevedb");
        var date = new Date();
        entry.timestamp = date;
        dbo.collection("changelog").insertOne(entry, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          db.close();
        });
      });
}
const port=3000;
app.listen(port, () => {
    console.log('Server started on port', port)
});