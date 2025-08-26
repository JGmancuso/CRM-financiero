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
            return [...tasksState, newTask].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        }
        
        case 'UPDATE_TASK': {
            const updatedTask = action.payload;
            return tasksState.map(t => t.id === updatedTask.id ? updatedTask : t);
        }

        case 'DELETE_TASK': {
            const taskId = action.payload;
            return tasksState.filter(t => t.id !== taskId);
        }
        
        // ¡Importante! Si la acción no le concierne, devuelve el estado sin cambios.
        default:
            return tasksState;
    }
};