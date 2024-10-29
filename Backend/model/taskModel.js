const pool = require('../config/db'); // Import the database connection

const Task = {
    create: async (task) => {
        const { title, description, is_recurring, recurrence_options } = task;
        const result = await pool.query(
            'INSERT INTO tasks (title, description, is_recurring, recurrence_options) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, is_recurring, recurrence_options]
        );
        return result.rows[0];
    },
    getAll: async () => {
        const result = await pool.query('SELECT * FROM tasks');
        return result.rows;
    },
    update: async (id, task) => {
        const { title, description, is_recurring, recurrence_options } = task;
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, is_recurring = $3, recurrence_options = $4 WHERE id = $5 RETURNING *',
            [title, description, is_recurring, recurrence_options, id]
        );
        return result.rows[0];
    },
    delete: async (id) => {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    }
};

module.exports = Task; // Export the Task model