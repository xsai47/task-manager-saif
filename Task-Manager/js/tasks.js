/**
 * Tasks module for handling task CRUD operations
 */
const TaskManager = {
    tasks: [],

    /**
     * Initialize tasks from storage
     */
    init() {
        this.tasks = Storage.getTasks();
    },

    /**
     * Create a new task
     * @param {Object} taskData - Data for the new task
     * @returns {Object} - The created task
     */
    createTask(taskData) {
        const newTask = {
            id: Date.now(),
            title: taskData.title,
            description: taskData.description || '',
            priority: taskData.priority || 'low',
            column: taskData.column || 'todo',
            dueDate: taskData.dueDate,
            tags: taskData.tags || [],
            createdAt: Date.now(),
            archived: false
        };

        this.tasks.push(newTask);
        this.save();
        return newTask;
    },

    /**
     * Update an existing task
     * @param {number} id - Task ID
     * @param {Object} updateData - Data to update
     * @returns {Object|null} - The updated task or null if not found
     */
    updateTask(id, updateData) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) return null;

        this.tasks[index] = { ...this.tasks[index], ...updateData };
        this.save();
        return this.tasks[index];
    },

    /**
     * Delete a task
     * @param {number} id - Task ID
     */
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
    },

    /**
     * Move a task between columns
     * @param {number} id - Task ID
     * @param {string} direction - 'left' or 'right'
     */
    moveTask(id, direction) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const columns = ['todo', 'inprogress', 'done'];
        const currentIndex = columns.indexOf(task.column);
        
        if (direction === 'left' && currentIndex > 0) {
            task.column = columns[currentIndex - 1];
        } else if (direction === 'right' && currentIndex < columns.length - 1) {
            task.column = columns[currentIndex + 1];
        }

        this.save();
    },

    /**
     * Save current tasks to storage
     */
    save() {
        Storage.saveTasks(this.tasks);
    },

    /**
     * Get all tasks (not archived)
     */
    getAllTasks() {
        return this.tasks.filter(t => !t.archived);
    },

    /**
     * Get a task by ID
     */
    getTaskById(id) {
        return this.tasks.find(t => t.id === id);
    }
};
