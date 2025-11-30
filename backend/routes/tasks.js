const express = require('express');
const Task = require('../models/Task');
const { apiAuthMiddleware } = require('../middleware/authMiddleware');
const { validationResult, body } = require('express-validator');
const router = express.Router();

// All routes are protected
router.use(apiAuthMiddleware);

// Validation rules
const taskValidation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .trim()
        .escape()
        .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
    body('description')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    body('priority')
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('category')
        .isIn(['work', 'personal', 'shopping', 'health', 'general']).withMessage('Invalid category')
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

// Create new task
router.post('/', taskValidation, async (req, res) => {
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

// Update task
router.put('/:id', taskValidation, async (req, res) => {
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
            req.body,
            { new: true, runValidators: true }
        );

        res.json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        console.error('Update task error:', error);
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

// Get task statistics
router.get('/stats', async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({ userId: req.session.user.id });
        const completedTasks = await Task.countDocuments({ 
            userId: req.session.user.id, 
            completed: true 
        });
        const pendingTasks = totalTasks - completedTasks;

        // Tasks by priority
        const priorityStats = await Task.aggregate([
            { $match: { userId: req.session.user.id } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        // Tasks by category
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

module.exports = router;