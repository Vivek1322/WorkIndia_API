var express 	= require('express'),
	app			= express(),
	bodyParser 	= require('body-parser'),
	mysql		= require('mysql'),
	bcrypt		= require('bcryptjs');


//CONFIGURING DATABASE
var con = require("./configure/database");
con.connect(function (err) {
	if (err) {
		console.log("Error connecting to the database!");
		throw err;
	}
	else {
		console.log("Connected!");
	}
});


//CREATING TABLES
var table = require("./configure/tables/index");
table.createTables();


//BASIC CONFIGURATIONS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//REQUIRING ROUTES
app.use("/", require("./routes/index"));


//INITIALIZING CONSTANTS
const PORT = process.env.PORT || 7000;


//LISTEN ON PORT
app.listen(PORT, function() {
	console.log('Server has started');
});