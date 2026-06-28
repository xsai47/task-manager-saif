/**
 * Storage module for handling all localStorage read/write logic
 */
const Storage = {
    KEYS: {
        TASKS: 'kanban_tasks',
        THEME: 'kanban_theme'
    },

    /**
     * Save tasks to localStorage
     * @param {Array} tasks - Array of task objects
     */
    saveTasks(tasks) {
        localStorage.setItem(this.KEYS.TASKS, JSON.stringify(tasks));
    },

    /**
     * Get tasks from localStorage
     * @returns {Array} - Array of task objects or empty array if none found
     */
    getTasks() {
        const tasks = localStorage.getItem(this.KEYS.TASKS);
        return tasks ? JSON.parse(tasks) : [];
    },

    /**
     * Save theme preference to localStorage
     * @param {string} theme - 'dark' or 'light'
     */
    saveTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
    },

    /**
     * Get theme preference from localStorage
     * @returns {string|null} - 'dark', 'light' or null
     */
    getTheme() {
        return localStorage.getItem(this.KEYS.THEME);
    }
};
