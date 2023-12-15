// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dbname',
  password: '12345678',
  port: 5432,
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Error fetching todos' });
  }
});

// Add a new todo
app.post('/todos', async (req, res) => {
  const { task, completed } = req.body;
  try {
    const result = await pool.query('INSERT INTO todos (task, completed) VALUES ($1, $2) RETURNING *', [task, completed]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'Error adding todo' });
  }
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  const id = req.params.id;
  const { task, completed } = req.body;
  try {
    const result = await pool.query('UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *', [task, completed, id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Error updating todo' });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Error deleting todo' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
