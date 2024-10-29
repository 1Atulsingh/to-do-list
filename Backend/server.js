require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this if your frontend is hosted elsewhere
}));
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
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/tasks', async (req, res) => {
    const { text, completed, recurrence, next_occurrence } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (text, completed, recurrence, next_occurrence) VALUES ($1, $2, $3, $4) RETURNING *',
            [text, completed, recurrence, next_occurrence]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding task:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params; // Get the task ID from the URL parameters
    const { text, completed, recurrence, next_occurrence } = req.body; // Get the updated task data from the request body

    try {
        const result = await pool.query(
            'UPDATE tasks SET text = $1, completed = $2, recurrence = $3, next_occurrence = $4 WHERE id = $5 RETURNING *',
            [text, completed, recurrence, next_occurrence, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(result.rows[0]); // Return the updated task
    } catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params; // Get the task ID from the URL parameters
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});