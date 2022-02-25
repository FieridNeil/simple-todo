import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const App = () => {
	const [newTodo, setNewTodo] = useState('');
	const [dueDate, setDueDate] = useState();
	const [time, setTime] = useState();
	const [todos, setTodos] = useState();
	// const [todos, setTodos] = useState([
	// 	{ task: 'Do laundry', done: false },
	// 	{ task: 'Buy gift for dad', done: false },
	// 	{ task: 'Wash car', done: false },
	// 	{ task: 'Attend wedding', done: false },
	// ]);
	const [test, setTest] = useState();

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URI}/api/todos`)
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				setTodos(res);
			})
			.catch((err) => console.log('Failed to fetch todo', err));
	}, []);

	const FormSubmitHandler = (e) => {
		e.preventDefault();
		fetch(`${process.env.REACT_APP_API_URI}/api/todo`, {
			method: 'POST',
			body: JSON.stringify({ name: newTodo, dueDate, time }),
			headers: { 'Content-Type': 'application/json' },
		});
		setNewTodo('');
	};

	const ChangeTaskStatusHander = (e) => {
		let temp = [...todos];
		const idx = temp.findIndex((x) => x.task === e.target.value);
		temp[idx].done = e.target.checked;
		setTodos(temp);
	};
	return (
		<div>
			<center>
				<h1>Simple Todo List</h1>
			</center>
			<div style={{ width: '40vw', margin: '0 auto' }}>
				<ListGroup>
					{todos?.map((elm, k) => (
						<ListGroup.Item key={k}>
							<input
								type='checkbox'
								style={{ marginRight: '5px' }}
								id={elm.name}
								onChange={ChangeTaskStatusHander}
								value={elm.name}
								name={elm.name}
							/>
							<label htmlFor={elm.task} style={elm.done ? { textDecoration: 'line-through' } : {}}>
								{elm.name}{' '}
								{elm.due_date && (
									<span>
										{' '}
										- By: {new Date(elm.due_date).toLocaleDateString()}{' '}
										{new Date(elm.due_date).toLocaleTimeString()}
									</span>
								)}
							</label>
						</ListGroup.Item>
					))}
				</ListGroup>
				<Form onSubmit={FormSubmitHandler}>
					<Form.Group
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gridTemplateRows: 'repeat(3, 1fr)',
							justifyItems: 'center',
							alignItems: 'center',
							rowGap: '5px',
						}}>
						<div>New Todo</div>
						<div>Due Date</div>
						<div>Time</div>

						<Form.Control
							type='text'
							value={newTodo}
							onChange={(e) => {
								setNewTodo(e.target.value);
							}}
						/>

						<Form.Control
							type='date'
							onChange={(e) => {
								setDueDate(e.target.value);
							}}
						/>

						<Form.Control
							type='time'
							onChange={(e) => {
								setTime(e.target.value);
							}}
						/>

						<Button type='submit' style={{ gridColumn: 'span 3', justifySelf: 'stretch' }}>
							Submit
						</Button>
					</Form.Group>
				</Form>
			</div>

			<button
				onClick={(e) => {
					e.preventDefault();

					fetch(`${process.env.REACT_APP_API_URI}/api`)
						.then((res) => res.json())
						.then((res) => setTest(res))
						.catch((err) => console.log(err));
				}}>
				Test Backend
			</button>
			{test && <div>{test.text}</div>}
		</div>
	);
};

export default App;
