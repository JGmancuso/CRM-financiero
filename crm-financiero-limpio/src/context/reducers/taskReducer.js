// src/context/reducers/taskReducer.js

// src/context/reducers/taskReducer.js

export const taskReducer = (tasksState, action) => {
    switch (action.type) {
        case 'ADD_TASK': {
            const newTask = {
                ...action.payload,
                id: `task-${Date.now()}`,
                createdAt: new Date().toISOString(),
                isCompleted: false
            };
            // Mantenemos la lista ordenada por fecha
            return [...tasksState, newTask].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        }
        
        case 'UPDATE_TASK': {
            const updatedTask = action.payload;
            return tasksState.map(t => t.id === updatedTask.id ? updatedTask : t);
        }

        case 'TOGGLE_TASK_COMPLETION': {
            // 👇 MEJORA: Aceptamos tanto el objeto completo COMO solo el ID.
            // Esto lo hace mucho más robusto ante diferentes formas de llamarlo.
            const taskId = action.payload.id || action.payload;
            return tasksState.map(t => 
                t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
            );
        }

        case 'DELETE_TASK': {
            // 👇 MEJORA: Convertimos a string para asegurar que la comparación funcione
            // incluso si por algún error antiguo el ID quedó como número.
            const idToDelete = action.payload.toString();
            return tasksState.filter(task => task.id && task.id.toString() !== idToDelete);
        }

        default:
            return tasksState;
    }
};