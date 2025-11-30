TaskMaster - Personal Task Management System
A modern, full-stack web application for managing daily tasks with user authentication, real-time progress tracking, and an intuitive dashboard.

🚀 Features
User Authentication - Secure login/register with session management
Task CRUD - Create, edit, delete, and mark tasks as complete
Smart Filtering - Filter by status, priority, date, and search all tasks
Progress Tracking - Visual statistics and circular progress indicator
Dark Mode - Toggle between light and dark themes
Responsive Design - Works seamlessly on mobile, tablet, and desktop
Priority System - Low, Medium, High priority levels with visual indicators
Due Dates & Categories - Organize tasks with dates and categories
Calendar View - See tasks organized by date

💻 Tech Stack
Backend: Node.js, Express.js, MongoDB, Mongoose
Frontend: EJS templates, Vanilla JavaScript, CSS3
Authentication: bcryptjs, express-session, express-validator
Database: MongoDB Atlas


📁 Project Structure
task-manager/
├── app.js                          # Main application entry point
├── package.json                    # Dependencies and scripts
├── backend/
│   ├── database/
│   │   └── database.js            # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js      # Authentication middleware
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Task.js                # Task schema
│   └── routes/
│       ├── auth.js                # Authentication routes
│       └── tasks.js               # Task CRUD routes
└── frontend/
    ├── public/
    │   ├── css/
    │   │   └── style.css          # Global styles
    │   ├── images/                # Static images
    │   └── js/
    │       └── script.js          # Client-side JavaScript
    └── views/
        ├── home.ejs               # Landing page
        ├── login.ejs              # Login page
        ├── register.ejs           # Registration page
        ├── welcome.ejs            # Main dashboard
        ├── error.ejs              # Error page
        └── 404.ejs                # 404 Not Found page

📦 Installation
Access at http://localhost:3000

🎯 Usage
Visit landing page and sign up
Login with credentials
Create and manage tasks from dashboard
Filter, search, and track progress
Toggle dark mode for comfortable viewing

👨‍💻 Developer
Developed as a personal productivity tool with modern web technologies.

📄 License
This project is open source and available for personal and educational use.

