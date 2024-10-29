const Task = require('../models/taskModel');

const taskController = {
    create: async (req, res) => {
        try {
            const task = await Task.create(req.body);
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ error: 'Error creating task' });
        }
    },
    // ... other methods
};

module.exports = taskController;