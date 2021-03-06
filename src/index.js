const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers
  const user = users.find(user => user.username === username)

    if (!user){
        return response.status(404).json({error: "Username not found"})
    }

    request.user = user

    return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  if (users.some(user => user.username === username)){
    return response.status(400).json({error: "Usuário já existe"})
  }

  users.push(user)

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  return response.json(request.user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title , deadline } = request.body

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  request.user.todos.push(todo)

  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body
  const {id} = request.params
  const todo = request.user.todos.find(todo => todo.id === id)

  if (!todo){
    return response.status(404).json({error: "ToDo inexistente!"})
  }

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params
  const todo = request.user.todos.find(todo => todo.id === id)
  
  if (!todo){
    return response.status(404).json({error: "ToDo inexistente!"})
  }

  todo.done = true
  
  return response.json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params
  const todo = request.user.todos.find(todo => todo.id === id)

  if (!todo){
    return response.status(404).json({error: "ToDo inexistente!"})
  }

  request.user.todos.splice(todo,1)

  return response.status(204).send()
});

module.exports = app;