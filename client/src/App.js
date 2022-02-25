import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import styled from 'styled-components';
import deleteIcon from './delete_icon.png';

const DeleteIcon = styled.img`
	width: 20px;
	height: 20px;
	&:hover {
		cursor: pointer;
	}
`;

const App = () => {
	const [newTodo, setNewTodo] = useState('');
	const [dueDate, setDueDate] = useState();
	const [time, setTime] = useState();
	const [todos, setTodos] = useState();
	const [err, setErr] = useState();

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URI}/api/todos`)
			.then((res) => res.json())
			.then((res) => {
				setTodos(res);
			})
			.catch((err) => console.log('Failed to fetch todo', err));
	}, []);

	const FormSubmitHandler = (e) => {
		if (newTodo === '') {
			e.preventDefault();
			setErr('Task name cannot be blank');
			return;
		}

		fetch(`${process.env.REACT_APP_API_URI}/api/todo`, {
			method: 'POST',
			body: JSON.stringify({ name: newTodo, dueDate, time }),
			headers: { 'Content-Type': 'application/json' },
		});
		setNewTodo('');
	};

	const ChangeTodoStatusHander = (e) => {
		let temp = [...todos];
		const idx = temp.findIndex((x) => x.name === e.target.value);
		temp[idx].done = e.target.checked;
		setTodos(temp);
	};

	const RemoveTodoHandler = (e, id) => {
		fetch(`${process.env.REACT_APP_API_URI}/delete_todo`, {
			method: 'POST',
			body: JSON.stringify({ id }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => res.json())
			.then((res) => console.log(res.status))
			.catch((err) => console.log('Failed to delete todo', err));
		window.location.reload();
	};

	return (
		<div>
			<center>
				<h1>Simple Todo List</h1>
			</center>

			<div style={{ width: '40vw', margin: '0 auto' }}>
				<ListGroup>
					{todos?.map((elm, k) => (
						<ListGroup.Item key={k} style={{ display: 'flex', alignItems: 'center' }}>
							<input
								type='checkbox'
								style={{ marginRight: '5px' }}
								id={elm.name}
								onChange={ChangeTodoStatusHander}
								value={elm.name}
								name={elm.name}
							/>
							<label htmlFor={elm.name} style={elm.done ? { textDecoration: 'line-through' } : {}}>
								{elm.name}{' '}
								{elm.due_date && (
									<span style={{ fontSize: '0.8em', fontStyle: 'italic' }}>
										- By: {new Date(elm.due_date).toLocaleDateString()}{' '}
										{new Date(elm.due_date).toLocaleTimeString() !== '12:00:00 AM' &&
											new Date(elm.due_date).toLocaleTimeString()}
									</span>
								)}
							</label>
							<div
								style={{ marginLeft: 'auto', marginRight: '0' }}
								onClick={(e, id) => RemoveTodoHandler(e, elm.id)}>
								<DeleteIcon src={require('./delete_icon.png')} />
								{/* <img src={require('./delete_icon.png')} style={{ width: '20px', height: '20px' }} /> */}
							</div>
						</ListGroup.Item>
					))}
				</ListGroup>

				{err && (
					<Alert className='my-3' variant='danger'>
						{err}
					</Alert>
				)}

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
						<div>Task Name</div>
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
		</div>
	);
};

export default App;
