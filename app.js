require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');

// Disable automatic pluralization BEFORE importing models
mongoose.pluralize(null);

const connectDB = require('./backend/database/database');

// Import routes
const authRoutes = require('./backend/routes/auth');
const taskRoutes = require('./backend/routes/tasks');

// Import middleware
const { authMiddleware } = require('./backend/middleware/authMiddleware');

// Import models
const Task = require('./backend/models/Task');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
// connectDB();
const mongourl = process.env.MONGO_URI;

mongoose.connect(mongourl)
  .then(() => {
    console.log(`connected to mongo db`);
  })
  .catch((error) => {
    console.log(`error is ${error.message}`);
  });


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend','public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend','views'));

// Routes

// Home route - Landing Page
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/welcome');
    } else {
        res.render('home');
    }
});

// Auth routes
app.use('/', authRoutes);

// Login page
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/welcome');
    }
    res.render('login', { 
        error: null, 
        formData: {},
        message: req.query.message 
    });
});

// Register page
app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/welcome');
    }
    res.render('register', { error: null, formData: {} });
});

// Welcome/Dashboard route (Protected)
app.get('/welcome', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.session.user.id })
            .sort({ createdAt: -1 })
            .limit(10); // Show only recent tasks
        
        const stats = {
            total: await Task.countDocuments({ userId: req.session.user.id }),
            completed: await Task.countDocuments({ 
                userId: req.session.user.id, 
                completed: true 
            })
        };
        
        stats.pending = stats.total - stats.completed;

        res.render('welcome', { 
            user: req.session.user,
            tasks: tasks,
            stats: stats
        });
    } catch (error) {
        console.error('Welcome page error:', error);
        res.status(500).render('welcome', { 
            user: req.session.user,
            tasks: [],
            stats: { total: 0, completed: 0, pending: 0 },
            error: 'Error loading tasks'
        });
    }
});

// API Routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).render('error', { 
        error: 'Something went wrong!',
        user: req.session.user || null
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { 
        user: req.session.user || null 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});