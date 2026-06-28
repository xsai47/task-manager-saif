/**
 * UI module for handling modals, theme toggling, and form interactions
 */
const UI = {
    currentTags: [],
    deleteId: null,

    init() {
        this.setupEventListeners();
        this.initTheme();
    },

    setupEventListeners() {
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Global Add Task button
        document.getElementById('add-task-btn').addEventListener('click', () => this.openAddModal());

        // Column Add Task buttons
        document.querySelectorAll('.add-column-task').forEach(btn => {
            btn.addEventListener('click', () => {
                const col = btn.dataset.column;
                this.openAddModal(col);
            });
        });

        // Task Form submission
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Tag input
        const tagInput = document.getElementById('tag-input');
        tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = tagInput.value.trim();
                if (tag) {
                    this.addTag(tag);
                    tagInput.value = '';
                }
            }
        });

        // Delete confirmation
        document.getElementById('confirm-delete').addEventListener('click', () => {
            if (this.deleteId) {
                TaskManager.deleteTask(this.deleteId);
                this.closeAllModals();
                App.refresh();
            }
        });

        document.getElementById('confirm-cancel').addEventListener('click', () => this.closeAllModals());

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Search and Filters
        document.getElementById('search-input').addEventListener('input', (e) => {
            Filters.currentSearch = e.target.value;
            App.refresh();
        });

        document.getElementById('priority-filter').addEventListener('change', (e) => {
            Filters.currentPriority = e.target.value;
            App.refresh();
        });

        document.getElementById('sort-select').addEventListener('change', (e) => {
            Filters.currentSort = e.target.value;
            App.refresh();
        });

        document.getElementById('clear-filters').addEventListener('click', () => {
            Filters.reset();
            App.refresh();
        });

        // Mobile Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const col = btn.dataset.column;
                document.querySelectorAll('.column').forEach(c => {
                    c.classList.toggle('active', c.dataset.column === col);
                });
            });
        });

        // Export button
        document.getElementById('export-btn').addEventListener('click', () => this.exportTasks());

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            // N to open new task modal (if no modal is open and not typing in an input)
            if (e.key.toLowerCase() === 'n' && !document.querySelector('.modal.active') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                this.openAddModal();
            }
            
            // Escape to close all modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // / to focus search bar
            if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                document.getElementById('search-input').focus();
            }
        });
    },

    exportTasks() {
        const tasks = TaskManager.tasks;
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kanban-tasks-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Theme Methods
    initTheme() {
        const savedTheme = Storage.getTheme();
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
    },

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        Storage.saveTheme(isDark ? 'dark' : 'light');
        document.getElementById('theme-toggle').innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    },

    // Modal Methods
    openAddModal(column = 'todo') {
        this.resetForm();
        document.getElementById('modal-title').textContent = 'Add New Task';
        document.getElementById('column-select').value = column;
        document.getElementById('task-modal').classList.add('active');
        
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('due-date').setAttribute('min', today);
    },

    openEditModal(id) {
        const task = TaskManager.getTaskById(id);
        if (!task) return;

        this.resetForm();
        document.getElementById('modal-title').textContent = 'Edit Task';
        document.getElementById('task-id').value = task.id;
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description;
        document.getElementById('priority').value = task.priority;
        document.getElementById('due-date').value = task.dueDate;
        document.getElementById('column-select').value = task.column;
        
        task.tags.forEach(tag => this.addTag(tag));
        
        document.getElementById('task-modal').classList.add('active');
    },

    showDeleteConfirm(id) {
        this.deleteId = id;
        document.getElementById('confirm-modal').classList.add('active');
    },

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        this.deleteId = null;
    },

    // Form & Tag Methods
    resetForm() {
        document.getElementById('task-form').reset();
        document.getElementById('task-id').value = '';
        this.currentTags = [];
        this.renderTags();
        this.clearErrors();
    },

    clearErrors() {
        document.querySelectorAll('.error-msg').forEach(e => {
            e.textContent = '';
            e.style.display = 'none';
        });
    },

    addTag(tag) {
        if (!this.currentTags.includes(tag)) {
            this.currentTags.push(tag);
            this.renderTags();
        }
    },

    removeTag(tag) {
        this.currentTags = this.currentTags.filter(t => t !== tag);
        this.renderTags();
    },

    renderTags() {
        const container = document.getElementById('tag-pills');
        container.innerHTML = '';
        this.currentTags.forEach(tag => {
            const pill = document.createElement('span');
            pill.className = 'tag-pill-editable';
            pill.innerHTML = `${tag} <i class="fas fa-times remove-tag" onclick="UI.removeTag('${tag}')"></i>`;
            container.appendChild(pill);
        });
    },

    handleFormSubmit() {
        const id = document.getElementById('task-id').value;
        const taskData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            dueDate: document.getElementById('due-date').value,
            column: document.getElementById('column-select').value,
            tags: this.currentTags
        };

        // Simple validation
        if (taskData.title.length < 3) {
            const error = document.getElementById('title-error');
            error.textContent = 'Title must be at least 3 characters';
            error.style.display = 'block';
            return;
        }

        if (id) {
            TaskManager.updateTask(Number(id), taskData);
        } else {
            TaskManager.createTask(taskData);
        }

        this.closeAllModals();
        App.refresh();
    }
};
