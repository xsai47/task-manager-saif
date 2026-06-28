# Kanban Task Manager

A professional, interactive Kanban-style task management application built with vanilla HTML, CSS, and JavaScript. This project was developed as a monthly performance evaluation assignment for the MERN Stack + AI Engineering Bootcamp.

## Features

### Core Functionality
- **Three-Column Board**: Manage tasks through "To Do", "In Progress", and "Done" columns.
- **Task CRUD**: Create, Read, Update, and Delete tasks with a clean modal interface.
- **Persistence**: All data is saved to `localStorage`, ensuring your board stays exactly as you left it across page reloads.
- **Real-time Statistics**: Dashboard bar showing total tasks, progress, completed count, overdue count, and a visual completion progress bar.
- **Inline Validation**: User-friendly form validation for task creation and editing.
- **Task Movement**: Move tasks between columns using intuitive arrow buttons on each card.
- **Visual Feedback**: Tasks in the "Done" column receive special styling (strikethrough, greyed out, checkmark).

### Advanced Features
- **Search & Filtering**: Real-time search by title, description, or tags, plus filtering by priority.
- **Sorting**: Sort tasks within columns by Due Date, Priority, or Date Created.
- **Dark/Light Mode**: Full theme support with persistence and no-flash page loading.
- **Responsive Design**: Optimized for Desktop (side-by-side columns), Tablet (vertical stack), and Mobile (tab-based view).

### Bonus Features
- **Drag and Drop**: Reorder tasks or move them between columns using the HTML5 Drag and Drop API.
- **Export to JSON**: Download your entire task list as a JSON file for backup or sharing.
- **Keyboard Shortcuts**: 
  - `N`: Open new task modal
  - `Esc`: Close open modals
  - `/`: Focus the search bar
- **Due Date Countdown**: Dynamic labels showing "Due today", "Due tomorrow", or "Due in X days".

## Technologies Used
- **HTML5**: Semantic structure and Drag & Drop API.
- **CSS3**: Custom properties (variables), Flexbox, Grid, and Animations.
- **Vanilla JavaScript**: ES6+ features, DOM manipulation, and localStorage API.
- **Google Fonts**: Inter font family.
- **Font Awesome**: Icon set for UI elements.

## Data Structure
Each task is stored as a JavaScript object within an array:

```javascript
{
  id: 1703001234567,       // Unique timestamp ID
  title: 'Build the board', // Required, min 3 chars
  description: '...',      // Optional textarea
  priority: 'high',        // 'low', 'medium', or 'high'
  column: 'todo',          // 'todo', 'inprogress', or 'done'
  dueDate: '2025-12-25',   // ISO date string
  tags: ['HTML', 'CSS'],   // Array of strings
  createdAt: 1703001234567, // Creation timestamp
  archived: false          // Boolean for archive feature
}
```

## How to Run Locally
1. Clone the repository to your local machine.
2. Navigate to the `task-manager/` directory.
3. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, or Safari).
4. No build process or server is required as this is a pure frontend application.

## What I Learned
During the development of this Kanban board, I deepened my understanding of state management in vanilla JavaScript. Handling complex interactions like simultaneous filtering, searching, and sorting while keeping the UI in sync with `localStorage` provided valuable insights into the "Model-View-Controller" pattern without using a framework. Implementing the HTML5 Drag and Drop API and ensuring a smooth responsive experience across mobile and desktop were particularly rewarding challenges.
