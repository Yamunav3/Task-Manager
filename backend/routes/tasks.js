
const express = require('express');
const Task = require('../models/Task');
const { apiAuthMiddleware } = require('../middleware/authMiddleware');
const { validationResult, body } = require('express-validator');
const router = express.Router();

// All routes are protected
router.use(apiAuthMiddleware);

// Validation for creating a task — title is required here
const createTaskValidation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .trim()
        .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('category')
        .optional()
        .isIn(['work', 'personal', 'shopping', 'health', 'general']).withMessage('Invalid category'),
    body('dueDate')
        .optional({ nullable: true })
        .isISO8601().withMessage('Invalid due date')
];

// Validation for updating a task — every field optional, only checked if present
const updateTaskValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('category')
        .optional()
        .isIn(['work', 'personal', 'shopping', 'health', 'general']).withMessage('Invalid category'),
    body('completed')
        .optional()
        .isBoolean().withMessage('Completed must be true or false'),
    body('dueDate')
        .optional({ nullable: true })
        .isISO8601().withMessage('Invalid due date')
];

// Get all tasks for user
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.session.user.id })
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

// Get task statistics
router.get('/stats', async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({ userId: req.session.user.id });
        const completedTasks = await Task.countDocuments({
            userId: req.session.user.id,
            completed: true
        });
        const pendingTasks = totalTasks - completedTasks;

        const priorityStats = await Task.aggregate([
            { $match: { userId: req.session.user.id } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        const categoryStats = await Task.aggregate([
            { $match: { userId: req.session.user.id } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.json({
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks,
            completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            priorityStats,
            categoryStats
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Error fetching statistics' });
    }
});

// Create new task
router.post('/', createTaskValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { title, description, priority, dueDate, category } = req.body;

        const task = new Task({
            title,
            description: description || '',
            priority: priority || 'medium',
            dueDate: dueDate || null,
            category: category || 'general',
            userId: req.session.user.id
        });

        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Error creating task' });
    }
});

// Update task (full edit form: title, description, priority, category, dueDate)
router.put('/:id', updateTaskValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.session.user.id
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
});

// Toggle completed status — used by the checkbox in the UI
router.put('/:id/toggle', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.session.user.id
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.completed = typeof req.body.completed === 'boolean'
            ? req.body.completed
            : !task.completed;

        await task.save();
        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error('Toggle task error:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.session.user.id
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});

module.exports = router;