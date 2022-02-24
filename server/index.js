const express = require('express');
const app = express();
const PORT = process.env.PORT | 4000;
const cors = require('cors');
const mysql = require('mysql2');

app.use(cors());

const conn = mysql.createConnection({
	host: '127.0.0.1',
	port: '3306',
	user: 'root',
	password: '1234',
	database: 'test'
});


app.get('/api', (req, res) => {
	console.log("/api is hit")
	conn.query('select * from todo',(err, results, fields) => {
		res.json({text: results[0].name})
	}
	);
})
app.get('/api/test', (req, res) => {
	console.log('we are getting signal!!!')
	res.json({ text: 'Broooo it works!!!!' });
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
