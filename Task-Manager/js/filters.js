/**
 * Filters module for handling search, filter, and sort logic
 */
const Filters = {
    currentSearch: '',
    currentPriority: 'all',
    currentSort: 'dateCreated',

    /**
     * Apply all filters and sort to a list of tasks
     * @param {Array} tasks - Tasks to filter
     * @returns {Array} - Filtered and sorted tasks
     */
    apply(tasks) {
        let filtered = [...tasks];

        // 1. Search filter
        if (this.currentSearch) {
            const query = this.currentSearch.toLowerCase();
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(query) || 
                t.description.toLowerCase().includes(query) ||
                t.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // 2. Priority filter
        if (this.currentPriority !== 'all') {
            filtered = filtered.filter(t => t.priority === this.currentPriority);
        }

        // 3. Sort
        filtered.sort((a, b) => {
            if (this.currentSort === 'dueDate') {
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (this.currentSort === 'priority') {
                const priorityMap = { 'high': 3, 'medium': 2, 'low': 1 };
                return priorityMap[b.priority] - priorityMap[a.priority];
            } else {
                // Default: dateCreated (newest first)
                return b.createdAt - a.createdAt;
            }
        });

        return filtered;
    },

    /**
     * Reset all filters
     */
    reset() {
        this.currentSearch = '';
        this.currentPriority = 'all';
        this.currentSort = 'dateCreated';
        
        // Update UI elements
        document.getElementById('search-input').value = '';
        document.getElementById('priority-filter').value = 'all';
        document.getElementById('sort-select').value = 'dateCreated';
    }
};
