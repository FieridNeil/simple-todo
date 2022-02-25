const mysql = require('mysql2');
const conn = mysql.createPool({
	host: '127.0.0.1',
	port: '3306',
	user: 'root',
	password: '1234',
	database: 'simpletodo',
});

module.exports = conn;
