const express = require('express');
const PORT = process.env.PORT | 4000;
const cors = require('cors');
const conn = require('./db/db_config');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/todos', (req, res) => {
	conn.query('select * from todo', (err, results, fields) => {
		if (err) throw new Error('Error in fetching todo tasks', err);
		res.json(results);
	});
});

app.post('/api/todo', (req, res) => {
	let sql = 'INSERT INTO todo (name, is_done, due_date) VALUES (?, 0, ?)';
	const datetime = req.body.dueDate + ' ' + req.body.time + ':00';

	conn.execute(sql, [req.body.name, datetime], (err, results, fields) => {
		if (err) throw new Error('Failed to insert into database', err);
		res.json({ status: 'OK' });
	});
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
