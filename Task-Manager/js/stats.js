/**
 * Stats module for updating the dashboard statistics bar
 */
const Stats = {
    /**
     * Update the stats bar based on the current tasks
     * @param {Array} tasks - All tasks
     */
    update(tasks) {
        const total = tasks.length;
        const inProgress = tasks.filter(t => t.column === 'inprogress').length;
        const completed = tasks.filter(t => t.column === 'done').length;
        
        // Overdue count: past due date and NOT in Done column
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const overdue = tasks.filter(t => {
            if (t.column === 'done' || !t.dueDate) return false;
            return new Date(t.dueDate) < today;
        }).length;

        // Completion percentage
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Update UI
        document.getElementById('total-tasks').textContent = total;
        document.getElementById('inprogress-tasks').textContent = inProgress;
        document.getElementById('completed-tasks').textContent = completed;
        document.getElementById('overdue-tasks').textContent = overdue;
        document.getElementById('completion-percent').textContent = `${percent}%`;
        document.getElementById('completion-bar').style.width = `${percent}%`;

        // Style overdue if > 0
        const overdueElement = document.querySelector('.stat-item.overdue');
        if (overdue > 0) {
            overdueElement.classList.add('has-overdue');
        } else {
            overdueElement.classList.remove('has-overdue');
        }
    }
};
