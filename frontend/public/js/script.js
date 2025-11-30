// Task Manager Frontend JavaScript

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTasks();
        this.setupTheme();
    }

    bindEvents() {
        // Task form submission
        document.getElementById('taskForm')?.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        
        // Search functionality
        document.getElementById('searchInput')?.addEventListener('input', (e) => this.handleSearch(e));
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
        
        // Sort dropdown
        document.getElementById('sortSelect')?.addEventListener('change', (e) => this.handleSort(e));
        
        // Theme toggle
        document.getElementById('themeBtn')?.addEventListener('click', () => this.toggleTheme());
        
        // Sidebar toggle
        document.getElementById('collapseBtn')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('openSidebar')?.addEventListener('click', () => this.openSidebar());
        
        // Global event listeners for dynamic elements
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('task-checkbox')) {
                this.handleTaskToggle(e);
            }
            if (e.target.classList.contains('delete-task')) {
                this.handleDeleteTask(e);
            }
            if (e.target.classList.contains('edit-task')) {
                this.handleEditTask(e);
            }
        });
    }

    async loadTasks() {
        try {
            this.showLoading();
            const response = await fetch('/api/tasks');
            
            if (!response.ok) throw new Error('Failed to fetch tasks');
            
            this.tasks = await response.json();
            this.renderTasks();
            this.updateStats();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showError('Failed to load tasks');
        } finally {
            this.hideLoading();
        }
    }

    async handleTaskSubmit(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            priority: document.getElementById('taskPriority').value,
            dueDate: document.getElementById('taskDueDate').value || null,
            category: document.getElementById('taskCategory').value
        };

        // Basic validation
        if (!formData.title.trim()) {
            this.showError('Task title is required');
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                this.resetForm();
                await this.loadTasks(); // Reload tasks to get the new one
                this.showSuccess('Task created successfully!');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            this.showError(error.message);
        }
    }

    async handleTaskToggle(e) {
        const taskItem = e.target.closest('.task-item');
        const taskId = taskItem.dataset.taskId;
        const completed = e.target.checked;

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update task');
            }

            // Update local state
            const task = this.tasks.find(t => t._id === taskId);
            if (task) task.completed = completed;
            
            this.updateStats();
            this.showSuccess(`Task marked as ${completed ? 'completed' : 'incomplete'}!`);
        } catch (error) {
            console.error('Error updating task:', error);
            e.target.checked = !completed; // Revert checkbox
            this.showError(error.message);
        }
    }

    async handleDeleteTask(e) {
        const taskItem = e.target.closest('.task-item');
        const taskId = taskItem.dataset.taskId;
        const taskTitle = taskItem.querySelector('.task-title').textContent;

        if (!confirm(`Are you sure you want to delete "${taskTitle}"?`)) return;

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Remove from local state
                this.tasks = this.tasks.filter(task => task._id !== taskId);
                taskItem.remove();
                this.updateStats();
                this.showSuccess('Task deleted successfully!');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showError(error.message);
        }
    }

    handleEditTask(e) {
        const taskItem = e.target.closest('.task-item');
        const taskId = taskItem.dataset.taskId;
        const task = this.tasks.find(t => t._id === taskId);
        
        if (task) {
            this.populateEditForm(task);
            this.showEditModal();
        }
    }

    populateEditForm(task) {
        document.getElementById('editTaskId').value = task._id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description || '';
        document.getElementById('editTaskPriority').value = task.priority;
        document.getElementById('editTaskDueDate').value = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
        document.getElementById('editTaskCategory').value = task.category || 'general';
    }

    async handleEditSubmit(e) {
        e.preventDefault();
        
        const taskId = document.getElementById('editTaskId').value;
        const formData = {
            title: document.getElementById('editTaskTitle').value,
            description: document.getElementById('editTaskDescription').value,
            priority: document.getElementById('editTaskPriority').value,
            dueDate: document.getElementById('editTaskDueDate').value || null,
            category: document.getElementById('editTaskCategory').value
        };

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.hideEditModal();
                await this.loadTasks();
                this.showSuccess('Task updated successfully!');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            this.showError(error.message);
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const taskItems = document.querySelectorAll('.task-item');
        
        taskItems.forEach(task => {
            const title = task.querySelector('.task-title').textContent.toLowerCase();
            const description = task.querySelector('.task-description')?.textContent.toLowerCase() || '';
            const matches = title.includes(searchTerm) || description.includes(searchTerm);
            task.style.display = matches ? 'flex' : 'none';
        });
    }

    handleFilter(e) {
        const filter = e.target.dataset.filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        this.currentFilter = filter;
        this.renderTasks();
    }

    handleSort(e) {
        this.currentSort = e.target.value;
        this.renderTasks();
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        if (!taskList) return;

        let filteredTasks = this.filterTasks(this.tasks);
        filteredTasks = this.sortTasks(filteredTasks);

        if (filteredTasks.length === 0) {
            taskList.innerHTML = this.getEmptyState();
            return;
        }

        taskList.innerHTML = filteredTasks.map(task => this.renderTask(task)).join('');
    }

    filterTasks(tasks) {
        switch (this.currentFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            case 'high-priority':
                return tasks.filter(task => task.priority === 'high');
            default:
                return tasks;
        }
    }

    sortTasks(tasks) {
        return tasks.sort((a, b) => {
            // Always prioritize high priority incomplete tasks first
            const aIsHighPriority = a.priority === 'high' && !a.completed;
            const bIsHighPriority = b.priority === 'high' && !b.completed;
            
            if (aIsHighPriority && !bIsHighPriority) return -1;
            if (!aIsHighPriority && bIsHighPriority) return 1;
            
            // Then prioritize overdue tasks
            const aIsOverdue = a.dueDate && new Date(a.dueDate) < new Date() && !a.completed;
            const bIsOverdue = b.dueDate && new Date(b.dueDate) < new Date() && !b.completed;
            
            if (aIsOverdue && !bIsOverdue) return -1;
            if (!aIsOverdue && bIsOverdue) return 1;
            
            // Then apply user-selected sort
            switch (this.currentSort) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'due-date':
                    return (new Date(a.dueDate) || new Date('9999-12-31')) - (new Date(b.dueDate) || new Date('9999-12-31'));
                default:
                    return 0;
            }
        });
    }

    renderTask(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = dueDate && dueDate < new Date() && !task.completed;
        
        return `
            <div class="task-item ${task.completed ? 'task-completed' : ''} ${isOverdue ? 'task-overdue' : ''}" data-task-id="${task._id}">
                <div class="task-info">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <div class="task-content">
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                        <div class="task-meta">
                            <span class="task-priority priority-${task.priority}">${task.priority}</span>
                            <span class="task-category">${task.category}</span>
                            ${dueDate ? `
                                <span class="task-due ${isOverdue ? 'text-danger' : 'muted'}">
                                    📅 ${dueDate.toLocaleDateString()} ${isOverdue ? '(Overdue)' : ''}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn edit-task" title="Edit task">✏️</button>
                    <button class="btn btn-danger delete-task" title="Delete task">🗑️</button>
                </div>
            </div>
        `;
    }

    getEmptyState() {
        const messages = {
            all: 'No tasks yet. Add your first task above!',
            active: 'No active tasks. Great job! 🎉',
            completed: 'No completed tasks yet.',
            'high-priority': 'No high priority tasks.'
        };

        return `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>${messages[this.currentFilter] || 'No tasks found'}</h3>
                <p class="muted">${this.currentFilter === 'all' ? 'Get started by creating your first task.' : 'Try changing your filters.'}</p>
            </div>
        `;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Update DOM elements if they exist
        const totalEl = document.getElementById('totalTasks');
        const completedEl = document.getElementById('completedTasks');
        const pendingEl = document.getElementById('pendingTasks');
        const rateEl = document.getElementById('completionRate');
        const taskCountEl = document.getElementById('taskCount');

        if (totalEl) totalEl.textContent = total;
        if (completedEl) completedEl.textContent = completed;
        if (pendingEl) pendingEl.textContent = pending;
        if (rateEl) rateEl.textContent = `${completionRate}%`;
        if (taskCountEl) taskCountEl.textContent = total;
    }

    resetForm() {
        document.getElementById('taskForm').reset();
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const themeBtn = document.getElementById('themeBtn');
        themeBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
        
        // Save theme preference
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            document.getElementById('themeBtn').textContent = '☀️';
        }
    }

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('collapsed');
        document.getElementById('openSidebar').style.display = 
            document.getElementById('sidebar').classList.contains('collapsed') ? 'block' : 'none';
    }

    openSidebar() {
        document.getElementById('sidebar').classList.remove('collapsed');
        document.getElementById('openSidebar').style.display = 'none';
    }

    showEditModal() {
        document.getElementById('editTaskModal').classList.add('show');
    }

    hideEditModal() {
        document.getElementById('editTaskModal').classList.remove('show');
    }

    showLoading() {
        document.body.classList.add('loading');
    }

    hideLoading() {
        document.body.classList.remove('loading');
    }

    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    showError(message) {
        this.showAlert(message, 'error');
    }

    showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 3000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the task manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});

// Add CSS animations for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .task-overdue {
        border-left: 4px solid var(--danger) !important;
        background: rgba(220, 53, 69, 0.05) !important;
    }
    
    .dark-theme .task-overdue {
        background: rgba(220, 53, 69, 0.1) !important;
    }
`;
document.head.appendChild(style);