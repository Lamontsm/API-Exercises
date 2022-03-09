var mysql = require('mysql2');
var mysql = require('knex');

var knex = require('knex')({
    client: 'mysql2',connection: {
        host     : '127.0.0.1',
        user     : 'root',
        // password : 'Bruno75', // CodeAnywhere doesn’t require a password for root
        database : 'Books'
    }
});
knex('Books').insert({
    Title: 'Harry Potter',
    Author: 'JK Rollings',
    Rating: 5,
    Index: 1
})
.then(function(){
    return knex.select().from('Books');
})
.then(function(data){
     console.log(data);
})
.catch(function(err){
     console.log(err);
});