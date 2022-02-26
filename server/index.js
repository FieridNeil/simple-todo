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
	let date;
	let time;
	let sql = 'INSERT INTO todo (name, is_done, due_date) VALUES (?, 0, ?)';
	let datetime = req.body.dueDate + ' ' + req.body.time + ':00';

	console.log(req.body.dueDate, req.body.time);
	if (req.body.dueDate === undefined && req.body.time === undefined) {
		datetime = null;
	} else {
		if (req.body.dueDate === undefined) {
			let today = new Date();
			date = today.getFullYear() + '-' + parseInt(today.getMonth() + 1) + '-' + today.getDate();
		} else {
			date = req.body.dueDate;
		}
		if (req.body.time === undefined) {
			time = '';
		} else {
			time = req.body.time;
		}
		datetime = date + ' ' + time;
	}

	conn.execute(sql, [req.body.name, datetime], (err, results, fields) => {
		if (err) throw new Error('Failed to insert into database', err);
		console.log(results);
		res.json({ status: 'OK', data: { id: results.insertId, due_date: datetime, is_done: 0, name: req.body.name } });
	});
});

app.post('/api/update_todo_status', (req, res) => {
	conn.execute('UPDATE todo SET is_done = ? WHERE id = ?', [req.body.status, req.body.id], (err, results, fields) => {
		if (err) throw new Error('Failed to update todo status', err);
		res.json({ status: 'OK' });
	});
});

app.post('/api/delete_todo', (req, res) => {
	conn.execute('DELETE FROM todo WHERE id = ?', [req.body.id], (err, results, fields) => {
		if (err) throw new Error('Failed to delete todo', err);
		console.log(results.i);
		res.json({ status: 'OK', data: { id: results.insertId } });
	});
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
