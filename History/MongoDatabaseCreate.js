// Got this from W3Schools. Think it applies more to 
// running mongodb locally.

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Lamont:44746&D#^ZrW@firsttest.zpvlr.mongodb.net/FirstTest?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});