/**
 * Board module for rendering columns and task cards
 */
const Board = {
    /**
     * Render the entire board
     * @param {Array} tasks - Tasks to render
     */
    render(tasks) {
        const columns = ['todo', 'inprogress', 'done'];
        
        columns.forEach(col => {
            const columnTasks = tasks.filter(t => t.column === col);
            this.renderColumn(col, columnTasks);
        });

        // Update counts
        this.updateCounts(tasks);
    },

    /**
     * Render a specific column
     * @param {string} columnId - ID of the column
     * @param {Array} tasks - Tasks in this column
     */
    renderColumn(columnId, tasks) {
        const listElement = document.getElementById(`${columnId}-list`);
        if (!listElement) return;

        listElement.innerHTML = '';
        
        if (tasks.length === 0) {
            listElement.innerHTML = '<div class="empty-state">No tasks found</div>';
            return;
        }

        tasks.forEach(task => {
            const card = this.createTaskCard(task);
            listElement.appendChild(card);
        });
    },

    /**
     * Create a task card element
     * @param {Object} task - Task object
     * @returns {HTMLElement} - The card element
     */
    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.dataset.id = task.id;
        card.draggable = true;

        const isOverdue = this.checkOverdue(task);
        const countdown = this.getCountdown(task);
        
        if (isOverdue && task.column !== 'done') {
            card.classList.add('overdue');
        }

        const description = task.description.length > 60 
            ? task.description.substring(0, 60) + '...' 
            : task.description;

        const dateFormatted = new Date(task.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const isDone = task.column === 'done';
        
        card.innerHTML = `
            <div class="card-header">
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                <div class="card-actions">
                    <button class="action-btn edit-btn" title="Edit Task"><i class="fas fa-pencil-alt"></i></button>
                    <button class="action-btn delete-btn" title="Delete Task"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
            <strong class="task-title">${isDone ? '<i class="fas fa-check-circle done-icon"></i>' : ''}${task.title}</strong>
            <div class="task-tags">
                ${task.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
            </div>
            <p class="task-desc">${description}</p>
            <div class="card-footer">
                <div class="due-date-info">
                    <span><i class="far fa-calendar-alt"></i> ${dateFormatted}</span>
                    ${isOverdue && !isDone ? '<span class="overdue-label">Overdue</span>' : ''}
                    ${!isOverdue && !isDone && countdown ? `<span class="countdown-label">${countdown}</span>` : ''}
                </div>
                <div class="move-actions">
                    ${task.column !== 'todo' ? '<button class="action-btn move-left" title="Move Left"><i class="fas fa-arrow-left"></i></button>' : ''}
                    ${task.column !== 'done' ? '<button class="action-btn move-right" title="Move Right"><i class="fas fa-arrow-right"></i></button>' : ''}
                </div>
            </div>
        `;

        // Add event listeners for buttons
        card.querySelector('.edit-btn').addEventListener('click', () => UI.openEditModal(task.id));
        card.querySelector('.delete-btn').addEventListener('click', () => UI.showDeleteConfirm(task.id));
        
        const moveLeft = card.querySelector('.move-left');
        if (moveLeft) moveLeft.addEventListener('click', () => this.handleMove(task.id, 'left'));
        
        const moveRight = card.querySelector('.move-right');
        if (moveRight) moveRight.addEventListener('click', () => this.handleMove(task.id, 'right'));

        // Drag events
        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', task.id);
        });

        card.addEventListener('dragend', () => {
            card.classList.add('dragging');
            document.querySelectorAll('.task-card').forEach(c => c.classList.remove('dragging'));
        });

        return card;
    },

    /**
     * Check if a task is overdue
     */
    checkOverdue(task) {
        if (!task.dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.dueDate);
        return dueDate < today;
    },

    /**
     * Get countdown string for due date
     */
    getCountdown(task) {
        if (!task.dueDate) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.dueDate);
        
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        if (diffDays > 1 && diffDays <= 7) return `Due in ${diffDays} days`;
        
        return null;
    },

    /**
     * Update task counts in column headers
     */
    updateCounts(tasks) {
        const todoCount = tasks.filter(t => t.column === 'todo').length;
        const inprogressCount = tasks.filter(t => t.column === 'inprogress').length;
        const doneCount = tasks.filter(t => t.column === 'done').length;

        document.getElementById('todo-count').textContent = todoCount;
        document.getElementById('inprogress-count').textContent = inprogressCount;
        document.getElementById('done-count').textContent = doneCount;
    },

    /**
     * Handle task movement
     */
    handleMove(id, direction) {
        TaskManager.moveTask(id, direction);
        App.refresh();
    }
};
