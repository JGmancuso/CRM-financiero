import { useMemo } from 'react';

// 1. El hook ahora recibe 'tasks', no 'clients'.
export function useAgenda(tasks) {
    // 2. Ya no necesitamos procesar los clientes, usamos la lista de 'tasks' directamente.
    const allTasks = tasks || [];

    const { today, tomorrow, twoWeeksFromNow } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Establece la hora a las 00:00:00 para comparaciones precisas
        
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const twoWeeksFromNow = new Date(today);
        twoWeeksFromNow.setDate(today.getDate() + 15); // Rango de 14 días a partir de mañana

        return { today, tomorrow, twoWeeksFromNow };
    }, []);

    const overdueTasks = useMemo(() => 
        allTasks.filter(task => {
            // 3. Usamos 'task.dueDate' en lugar de 'task.date'
            const taskDate = new Date(task.dueDate + 'T00:00:00'); // Aseguramos que se interprete como local
            return taskDate < today && !task.isCompleted;
        }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)), 
    [allTasks, today]);
        
    const eventsToday = useMemo(() => 
        allTasks.filter(task => {
            // 3. Usamos 'task.dueDate' en lugar de 'task.date'
            const taskDate = new Date(task.dueDate + 'T00:00:00');
            return taskDate.getTime() === today.getTime() && !task.isCompleted;
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [allTasks, today]);
        
    const upcomingEvents = useMemo(() => 
        allTasks.filter(task => {
            // 3. Usamos 'task.dueDate' en lugar de 'task.date'
            const taskDate = new Date(task.dueDate + 'T00:00:00');
            return taskDate >= tomorrow && taskDate < twoWeeksFromNow && !task.isCompleted;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
    [allTasks, tomorrow, twoWeeksFromNow]);

    return { overdueTasks, eventsToday, upcomingEvents };
}