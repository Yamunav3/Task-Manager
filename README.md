TaskMaster - Personal Task Management System

A modern, full-stack web application for managing daily tasks with user authentication, real-time progress tracking, and an intuitive dashboard.

🚀 Features
🔐 User Authentication

Secure Login & Registration

Password hashing using bcryptjs

Session handling with express-session

📝 Task Management (CRUD)

Create, Read, Update, Delete tasks

Mark tasks as completed

Delete multiple tasks

🎯 Smart Filtering

Filter by All, Active, Completed, High Priority

Search tasks (title + description)

📊 Progress Tracking

Auto-updating circular progress bar

Smart overdue & urgent task detection

Stats: Total, Completed, Pending

🌙 Dark / Light Mode

Single-click theme switching

Saved in localStorage

📱 Responsive UI

Works on desktop, tablet, mobile

Animated components

Modern, clean UI

🗂️ Extra Features

Priority Levels: Low, Medium, High

Due Date support

Task Categories (Work, Personal, Health, etc.)

Calendar View (Upcoming feature)

💻 Tech Stack
Backend

Node.js

Express.js

MongoDB & Mongoose

Frontend

EJS template engine

Vanilla JavaScript

Modern CSS3

Authentication

bcryptjs

express-session

express-validator

Database

MongoDB Atlas

📁 Project Structure
task-manager/
├── app.js                          # Main application entry point
├── package.json                    # Dependencies and scripts
├── backend/
│   ├── database/
│   │   └── database.js             # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js       # Authentication middleware
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   └── Task.js                 # Task schema
│   └── routes/
│       ├── auth.js                 # Authentication routes
│       └── tasks.js                # Task CRUD routes
└── frontend/
    ├── public/
    │   ├── css/
    │   │   └── style.css           # Global styles
    │   ├── images/                 # Static assets
    │   └── js/
    │       └── script.js           # Client-side JS
    └── views/
        ├── home.ejs                # Landing page
        ├── login.ejs               # Login page
        ├── register.ejs            # Registration page
        ├── welcome.ejs             # Main dashboard
        ├── error.ejs               # Error page
        └── 404.ejs                 # 404 Not Found page

📦 Installation

Clone the repository:

git clone https://github.com/Yamunav3/Task-Manager.git


Navigate to project:

cd task-manager


Install dependencies:

npm install


Create .env file and add:

MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_secret_key
PORT=3000


Start the server:

npm start


Visit:

http://localhost:3000

🎯 Usage

Open app in browser

Register a new user

Log in with your credentials

Start managing your tasks

Filter, search, sort tasks

Toggle dark mode anytime

👨‍💻 Developer

Built with ❤️ by Yamuna
Designed as a personal productivity tool using modern full-stack development technologies.

📄 License

This project is open-source and available for personal and educational use.
