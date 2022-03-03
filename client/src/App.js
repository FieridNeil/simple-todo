import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import styled from 'styled-components';
import Dropdown from 'react-bootstrap/Dropdown';
import './App.css';

const server_host = `${process.env.REACT_APP_API_URI}`;

const DeleteIcon = styled.img`
	width: 20px;
	height: 20px;
	&:hover {
		cursor: pointer;
	}
`;

const App = () => {
	const [newTodo, setNewTodo] = useState('');
	const [dueDate, setDueDate] = useState('');
	const [time, setTime] = useState('');
	const [todos, setTodos] = useState();
	const [err, setErr] = useState();
	const [avatars, setAvatars] = useState();
	const [reload, setReload] = useState(false);

	useEffect(() => {
		fetch(`${server_host}/api/todos`)
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				setTodos(res);
			})
			.catch((err) => console.log('Failed to fetch todo', err));

		fetch(`${server_host}/api/avatars`)
			.then((res) => res.json())
			.then((res) => setAvatars(res))
			.catch((err) => console.log('Failed to fetch avatars', err));
	}, [reload]);

	const FormSubmitHandler = (e) => {
		e.preventDefault();
		if (newTodo === '') {
			setErr('Task name cannot be blank');
			return;
		}

		fetch(`${server_host}/api/add_todo`, {
			method: 'POST',
			body: JSON.stringify({ name: newTodo, dueDate, time }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => res.json())
			.then((res) => {
				setTodos([...todos, res.data]);
				setNewTodo('');
				setDueDate('');
				setTime('');
				setErr();
				setReload(!reload);
			})
			.catch((err) => console.log('Failed to add new todo', err));
	};

	const ChangeTodoStatusHander = (e, id) => {
		console.log(e.target.checked);
		fetch(`${server_host}/api/update_todo_status`, {
			method: 'POST',
			body: JSON.stringify({ id, status: e.target.checked }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => res.json())
			.then((res) => {
				let temp = [...todos];
				const idx = temp.findIndex((x) => x.name === e.target.value);
				temp[idx].is_done = e.target.checked;
				setTodos(temp);
			});
	};

	const RemoveTodoHandler = (e, id) => {
		e.preventDefault();
		fetch(`${server_host}/api/delete_todo`, {
			method: 'POST',
			body: JSON.stringify({ id }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => res.json())
			.then((res) => {
				let temp = [...todos];
				let idx = temp.findIndex((x) => x.id === id);
				temp.splice(idx, 1);
				setTodos(temp);
			})
			.catch((err) => console.log('Failed to delete todo', err));
	};

	const AvatarChangeHandler = (e, todoID, avtID) => {
		e.preventDefault();
		fetch(`${server_host}/api/update_todo_avt`, {
			method: 'POST',
			body: JSON.stringify({ todoID, avtID }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => res.json())
			.then((res) => {
				setReload(!reload);
				console.log(res);
			})
			.catch((err) => console.log('Failed to update todo avatar', err));
	};

	return (
		<div style={{ paddingTop: '50px' }}>
			<center>
				<h1>Simple Todo List</h1>
			</center>

			<div style={{ width: '35vw', margin: '0 auto' }}>
				<ListGroup>
					{todos?.map((elm, k) => (
						<ListGroup.Item key={k} style={{ display: 'flex', alignItems: 'center' }}>
							<Dropdown>
								<Dropdown.Toggle
									style={{
										backgroundColor: `${elm.background_color}`,
										color: 'black',
										borderColor: elm.background_color,
									}}
									className='avatar-background'>
									<div className='avatar-letter'>{elm.initial}</div>
								</Dropdown.Toggle>

								<Dropdown.Menu>
									{avatars?.map((el, k) => (
										<Dropdown.Item key={k}>
											<div
												style={{
													backgroundColor: el.background_color,
												}}
												className='avatar-background'>
												<div
													className='avatar-letter'
													onClick={(e, todoID, avtID) =>
														AvatarChangeHandler(e, elm.id, el.id)
													}>
													{el.initial}
												</div>
											</div>
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
							<input
								type='checkbox'
								style={{ margin: '0px 5px 0px 10px' }}
								id={elm.name}
								onChange={(e, id) => ChangeTodoStatusHander(e, elm.id)}
								value={elm.name}
								name={elm.name}
								defaultChecked={elm.is_done}
							/>
							<label htmlFor={elm.name} style={elm.is_done ? { textDecoration: 'line-through' } : {}}>
								{elm.name}{' '}
								{elm.due_date && (
									<span style={{ fontSize: '0.8em', fontStyle: 'italic' }}>
										By: {new Date(elm.due_date).toLocaleDateString()}{' '}
										{new Date(elm.due_date).toLocaleTimeString() !== '12:00:00 AM' &&
											new Date(elm.due_date).toLocaleTimeString()}
									</span>
								)}
							</label>
							<div
								style={{ marginLeft: 'auto', marginRight: '0' }}
								onClick={(e, id) => RemoveTodoHandler(e, elm.id)}>
								<DeleteIcon src={require('./delete_icon.png')} />
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
							value={dueDate}
							onChange={(e) => {
								setDueDate(e.target.value);
							}}
						/>

						<Form.Control
							type='time'
							value={time}
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
			{console.log(reload)}
		</div>
	);
};

export default App;
