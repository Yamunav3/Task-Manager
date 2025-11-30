
# TaskMaster - Personal Task Management System

A modern, full-stack web application for managing daily tasks with user authentication, real-time progress tracking, and an intuitive dashboard.

## 🚀 Features

- **User Authentication** - Secure login/register with session management
- **Task CRUD** - Create, edit, delete, and mark tasks as complete
- **Smart Filtering** - Filter by status, priority, date, and search all tasks
- **Progress Tracking** - Visual statistics and circular progress indicator
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Priority System** - Low, Medium, High priority levels with visual indicators
- **Due Dates & Categories** - Organize tasks with dates and categories
- **Calendar View** - See tasks organized by date

## 💻 Tech Stack

### Backend

- Node.js
- Express.js v5.1.0
- MongoDB with Mongoose v9.0.0
- express-session v1.18.2
- bcryptjs (password hashing)
- express-validator v7.3.1
- dotenv v17.2.3

### Frontend

- EJS v3.1.10 (templating engine)
- Vanilla JavaScript
- CSS3 with animations
- Responsive design

### Database

- MongoDB Atlas

## 📁 Project Structure

```
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
    │   └── js/
    │       └── script.js          # Client-side JavaScript
    └── views/
        ├── home.ejs               # Landing page
        ├── login.ejs              # Login page
        ├── register.ejs           # Registration page
        ├── welcome.ejs            # Main dashboard
        ├── error.ejs              # Error page
        └── 404.ejs                # 404 Not Found page
```

## 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/task-manager.git
   cd task-manager
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `backend/.env` file with the following:

   ```env
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret_key
   PORT=3000
   ```

4. **Start the server:**

   ```bash
   node app.js
   ```

   Or use nodemon for development:

   ```bash
   npm run dev
   ```

5. **Access the application:**

   Open your browser and navigate to `http://localhost:3000`

## 🎯 Usage

1. Visit the landing page at `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Login with your credentials
4. Start creating and managing your tasks from the dashboard
5. Use filters to organize tasks by status, priority, or date
6. Toggle dark mode for comfortable viewing
7. Search across all tasks using the search bar

## 📱 Application Routes

- `/` - Landing page with Login/Sign Up options
- `/register` - User registration page
- `/login` - User login page
- `/welcome` - Main dashboard (protected route)
- `/logout` - Logout and return to landing page

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- Protected routes with middleware
- Input validation and sanitization
- Secure error messages

## 🎨 Key Functionalities

### Task Management

- Create tasks with title, description, priority, category, and due date
- Edit existing tasks
- Delete tasks with confirmation
- Mark tasks as completed/incomplete
- View task creation dates

### Filtering & Views

- **All Tasks** - View all your tasks
- **Today's Tasks** - Tasks created today
- **Oldest Tasks** - Tasks older than 7 days
- **Priority Tasks** - Only high-priority tasks
- **Upcoming Due Dates** - Tasks with future due dates
- **Search** - Search across all task fields

### Dashboard Features

- Real-time task statistics (Total, Completed, Pending)
- Circular progress indicator showing completion percentage
- Urgent task notifications
- Overdue task indicators
- Sidebar navigation
- Calendar view

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is open source and available for personal and educational use.

## 👨‍💻 Developer

Developed with ❤️ for productivity enthusiasts

---

**Happy Task Managing! 📝✅**
