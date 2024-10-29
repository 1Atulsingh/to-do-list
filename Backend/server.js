// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Routes
app.get('/tasks', async (req, res) => {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
});

app.post('/tasks', async (req, res) => {
    const { text, completed, recurrence, next_occurrence } = req.body;
    const result = await pool.query(
        'INSERT INTO tasks (text, completed, recurrence, next_occurrence) VALUES ($1, $2, $3, $4) RETURNING *',
        [text, completed, recurrence, next_occurrence]
    );
    res.status(201).json(result.rows[0]);
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { text, completed, recurrence, next_occurrence } = req.body;
    const result = await pool.query(
        'UPDATE tasks SET text = $1, completed = $2, recurrence = $3, next_occurrence = $4 WHERE id = $5 RETURNING *',
        [text, completed, recurrence, next_occurrence, id]
    );
    res.json(result.rows[0]);
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});