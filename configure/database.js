var mysql = require("mysql");

var con = mysql.createConnection({
	host: process.env.HOST || "localhost",
	user: process.env.USER || "root",
	password: process.env.PASSWORD || "",
	port: 3306,
	database: process.env.DATABASE || "work_india",
	multipleStatements: true
});

module.exports = con;