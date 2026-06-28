/**
 * Main App module to coordinate all components
 */
const App = {
    init() {
        // Initialize all modules
        TaskManager.init();
        UI.init();
        
        // Initial render
        this.refresh();
        
        // Setup drag and drop for columns
        this.setupDragAndDrop();

        // Handle mobile tab initialization
        if (window.innerWidth < 1024) {
            document.querySelector('.column[data-column="todo"]').classList.add('active');
        }

        console.log('Kanban App Initialized');
    },

    /**
     * Refresh the entire board and statistics
     */
    refresh() {
        const allTasks = TaskManager.getAllTasks();
        const filteredTasks = Filters.apply(allTasks);
        
        Board.render(filteredTasks);
        Stats.update(allTasks);
    },

    /**
     * Setup HTML5 Drag and Drop API
     */
    setupDragAndDrop() {
        const lists = document.querySelectorAll('.task-list');
        
        lists.forEach(list => {
            list.addEventListener('dragover', (e) => {
                e.preventDefault();
                list.classList.add('drag-over');
            });

            list.addEventListener('dragleave', () => {
                list.classList.remove('drag-over');
            });

            list.addEventListener('drop', (e) => {
                e.preventDefault();
                list.classList.remove('drag-over');
                
                const taskId = e.dataTransfer.getData('text/plain');
                const column = list.parentElement.dataset.column;
                
                if (taskId && column) {
                    TaskManager.updateTask(Number(taskId), { column: column });
                    this.refresh();
                }
            });
        });
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
