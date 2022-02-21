import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

const App = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([
    { task: "Do laundry", done: false },
    { task: "Buy gift for dad", done: false },
    { task: "Wash car", done: false },
    { task: "Attend wedding", done: false },
  ]);

  const FormSubmitHandler = (e) => {
    e.preventDefault();
    setTodos([...todos, { task: newTodo, done: false }]);
    setNewTodo("");
  };

  const ChangeTaskStatusHander = (e) => {
    let temp = [...todos];
    const idx = temp.findIndex((x) => x.task === e.target.value);
    temp[idx].done = e.target.checked;
    setTodos(temp);
  };
  return (
    <div>
      <h1>Simple Todo List</h1>
      <div style={{ width: "40vw", margin: "0 auto" }}>
        <ListGroup>
          {todos.map((elm, k) => (
            <ListGroup.Item key={k}>
              <input
                type="checkbox"
                style={{ marginRight: "5px" }}
                id={elm.task}
                onChange={ChangeTaskStatusHander}
                value={elm.task}
                name={elm.task}
              />
              <label
                htmlFor={elm.task}
                style={elm.done ? { textDecoration: "line-through" } : {}}
              >
                {elm.task}
              </label>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Form onSubmit={FormSubmitHandler}>
          <Form.Group>
            <Form.Control
              type="text"
              value={newTodo}
              onChange={(e) => {
                setNewTodo(e.target.value);
              }}
              placeholder="New todo..."
            />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default App;
