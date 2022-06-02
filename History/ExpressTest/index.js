// Set express as Node.js web application 
// server framework. 
  
// Install it using 'npm install express' command 
// and require like this:
var express = require('express'); 
var app = express(); 
    
// Set EJS as templating engine 
app.set('view engine', 'ejs'); 
  
app.get("/", function(req, res) {  
  // res.render("home", {name:'Chris Martin'});
  res.render("home", {name:'James Bond', age: 65});
});
    
// Server setup
app.listen(3000, function(req, res) {
  console.log("Connected on port:3000");
});