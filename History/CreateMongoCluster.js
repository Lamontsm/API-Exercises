// copied from W3 Schools
// https://www.w3schools.com/nodejs/nodejs_mongodb_createcollection.asp

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb+srv://Lamont:44746&D#^ZrW@firsttest.zpvlr.mongodb.net/bookAPI?retryWrites=true&w=majority";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   dbo.createCollection("books", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });

// From MongoDb site at database deployment and connect
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Lamont:44746&D#^ZrW@firsttest.zpvlr.mongodb.net/FirstTest?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("books");
  // perform actions on the collection object
  client.close();
});