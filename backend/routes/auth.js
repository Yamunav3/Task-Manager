const express = require('express');
const User = require('../models/User');
const { validationResult, body } = require('express-validator');
const router = express.Router();

// Validation rules
const registerValidation = [
    body('username')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
        .trim()
        .escape(),
    body('email')
        .isEmail().withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email')
        .isEmail().withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Register route
router.post('/register', registerValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('register', { 
                error: errors.array()[0].msg,
                formData: req.body
            });
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render('register', { 
                error: 'You are already registered with this email. Please login instead.',
                formData: req.body
            });
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();

        res.redirect('/login?message=Registration successful. Please login.');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).render('register', { 
            error: 'Server error during registration',
            formData: req.body
        });
    }
});

// Login route
router.post('/login', loginValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('login', { 
                error: errors.array()[0].msg,
                formData: req.body,
                message: null
            });
        }

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render('login', { 
                error: 'Incorrect password. Please check your password and try again.',
                formData: req.body,
                message: null
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).render('login', { 
                error: 'Incorrect password. Please check your password and try again.',
                formData: req.body,
                message: null
            });
        }

        // Create session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        res.redirect('/welcome');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('login', { 
            error: 'Server error during login',
            formData: req.body,
            message: null
        });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

module.exports = router;