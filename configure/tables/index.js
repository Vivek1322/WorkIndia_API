var con = require('../database');


var table = {};
table.createTables = function(req, res, next){
	con.query('CREATE TABLE IF NOT EXISTS users (id INTEGER NOT NULL AUTO_INCREMENT, username VARCHAR(255), password BINARY(60), UNIQUE(id), PRIMARY KEY(username))', function(err, result){
		if(err){
			console.log('Error creating user table');
			throw err;
		}
	});

	con.query('CREATE TABLE IF NOT EXISTS list (id INTEGER NOT NULL AUTO_INCREMENT, website VARCHAR(255), username VARCHAR(255), password VARCHAR(255), userId INTEGER, UNIQUE(id), PRIMARY KEY(id), FOREIGN KEY (userId) REFERENCES users(id))', function(err, result){
		if(err){
			console.log('Error creating list table');
			throw err;
		}
	});
}


module.exports = table;