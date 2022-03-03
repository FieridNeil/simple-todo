const express = require('express');
const PORT = process.env.PORT | 4000;
const cors = require('cors');
const conn = require('./db/db_config');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/todos', (req, res) => {
	conn.query(
		'select todo.id, todo.name, todo.is_done, todo.due_date, avatar.id as avt_id, avatar.initial, avatar.background_color from todo inner join avatar where todo.avt_id = avatar.id',
		(err, results, fields) => {
			if (err) throw new Error('Error in fetching todo tasks', err);
			res.json(results);
		}
	);
});

app.get('/api/avatars', (req, res) => {
	conn.query('select * from avatar', (err, results, fields) => {
		if (err) throw new Error('Error in fetching avatars', err);
		res.json(results);
	});
});

app.post('/api/add_todo', (req, res) => {
	let date;
	let time;
	let sql = 'INSERT INTO todo (name, is_done, due_date, avt_id) VALUES (?, 0, ?, 1)';
	let datetime = req.body.dueDate + ' ' + req.body.time + ':00';

	if (req.body.dueDate === '' && req.body.time === '') {
		datetime = null;
	} else {
		if (req.body.dueDate === '') {
			let today = new Date();
			date = today.getFullYear() + '-' + parseInt(today.getMonth() + 1) + '-' + today.getDate();
		} else {
			date = req.body.dueDate;
		}
		if (req.body.time === '') {
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

app.post('/api/update_todo_avt', (req, res) => {
	conn.execute(
		'UPDATE todo SET avt_id = ? WHERE id = ?',
		[req.body.avtID, req.body.todoID],
		(err, results, fields) => {
			if (err) throw new Error('Failed to update todo avatar', err);
			res.json({ status: 'OK' });
		}
	);
});

app.post('/api/delete_todo', (req, res) => {
	conn.execute('DELETE FROM todo WHERE id = ?', [req.body.id], (err, results, fields) => {
		if (err) throw new Error('Failed to delete todo', err);
		console.log(results);
		res.json({ status: 'OK' });
	});
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
