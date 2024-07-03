const express = require('express');
const router = express.Router();
const { Task, validateTask } = require('../models/task');
const auth = require('../middleware/auth'); // Assuming you have authentication middleware
const verifyUser = require('../middleware/verifyUser'); // Import verifyUser middleware

// Middleware to get task by ID
async function getTask(req, res, next) {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Ensure the user can only access their own tasks
        if (!task.user.equals(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        res.task = task;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Create a new task
router.post('/', auth, async (req, res) => {
    try {
        const { error } = validateTask(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const { title, task, completed } = req.body;
        const newTask = new Task({ title, task, completed, user: req.user._id });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get a specific task by ID
router.get('/:id', auth, getTask, (req, res) => {
    res.json(res.task);
});

// Update a specific task by ID
router.put('/:id', auth, verifyUser, getTask, async (req, res) => {
    try {
        const { error } = validateTask(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const { title, task, completed } = req.body;
        if (title) res.task.title = title;
        if (task) res.task.task = task;
        if (typeof completed !== 'undefined') res.task.completed = completed;

        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a specific task by ID
router.delete('/:id', auth, verifyUser, getTask, async (req, res) => {
    try {
        await res.task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
