import { useMemo } from 'react';

// Función auxiliar para obtener el inicio y fin de la semana actual
const getWeekInfo = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
    
    // Calcula el inicio de la semana (Lunes)
    const startOfWeek = new Date(today);
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    // Calcula el fin de la semana (Domingo)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 15);

    return { today, tomorrow, startOfWeek, endOfWeek, twoWeeksFromNow };
};


export function useAgenda(clients, tasks, filter = 'todos') {
    
    const allItems = useMemo(() => {
        // Mapea las tareas del embudo y las tareas generales, asignando su origen
        const funnelTasks = (tasks || [])
            .filter(task => task.dueDate)
            .map(task => ({
                ...task,
                source: task.clientName === 'Tarea General' ? 'gestiones' : 'embudo',
            }));

        // Mapea las actividades de los clientes, asignando su origen
        const clientActivities = (clients || [])
            .flatMap(client => 
                (client.activities || [])
                    .filter(activity => activity.date)
                    .map(activity => ({
                        id: activity.id,
                        title: activity.description || 'Actividad',
                        details: activity.note,
                        dueDate: activity.date,
                        isCompleted: activity.completed || false,
                        clientName: client.nombre || client.name,
                        clientId: client.id,
                        type: 'activity',
                        source: 'clientes',
                    }))
            );

        const combined = [...funnelTasks, ...clientActivities];
        
        // Aplica el filtro por origen si no es 'todos'
        if (filter === 'todos') {
            return combined;
        }
        return combined.filter(item => item.source === filter);

    }, [clients, tasks, filter]);

    const { today, tomorrow, startOfWeek, endOfWeek, twoWeeksFromNow } = useMemo(getWeekInfo, []);

    // Clasificación de Tareas por fecha
    const overdueTasks = useMemo(() => allItems.filter(item => new Date(item.dueDate + 'T00:00:00') < today && !item.isCompleted), [allItems, today]);
    
    const tasksByDayOfWeek = useMemo(() => {
        const weekTasks = allItems.filter(item => {
            const itemDate = new Date(item.dueDate + 'T00:00:00');
            return itemDate >= startOfWeek && itemDate <= endOfWeek && !item.isCompleted;
        });

        return weekTasks.reduce((acc, task) => {
            let day = new Date(task.dueDate + 'T00:00:00').getDay();
            if (day === 0) day = 7; // Convertimos Domingo (0) a 7 para el orden
            (acc[day] = acc[day] || []).push(task);
            return acc;
        }, {});
    }, [allItems, startOfWeek, endOfWeek]);

    const futureTasks = useMemo(() => allItems.filter(item => {
        const itemDate = new Date(item.dueDate + 'T00:00:00');
        return itemDate > endOfWeek && !item.isCompleted;
    }), [allItems, endOfWeek]);

    // Lógica para el Dashboard
    const eventsToday = useMemo(() => allItems.filter(item => new Date(item.dueDate + 'T00:00:00').getTime() === today.getTime() && !item.isCompleted), [allItems, today]);
    const upcomingEvents = useMemo(() => allItems.filter(item => {
        const itemDate = new Date(item.dueDate + 'T00:00:00');
        return itemDate >= tomorrow && itemDate < twoWeeksFromNow && !item.isCompleted;
    }), [allItems, tomorrow, twoWeeksFromNow]);


    return { overdueTasks, tasksByDayOfWeek, futureTasks, eventsToday, upcomingEvents };
}