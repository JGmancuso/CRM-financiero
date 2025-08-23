import { useMemo } from 'react';

export function useAgenda(clients, tasks) {
    
    const allItems = useMemo(() => {
        console.log("--- DEBUG: Datos recibidos por useAgenda ---");
        console.log("Tasks (del embudo):", tasks);
        console.log("Clients (con actividades):", clients);

        const funnelTasks = (tasks || [])
            .filter(task => task.dueDate)
            .map(task => ({
                id: task.id, title: task.title, details: task.details,
                dueDate: task.dueDate, isCompleted: task.isCompleted || false,
                clientName: task.clientName, clientId: task.clientId, type: 'task'
            }));

        // --- LÓGICA CORREGIDA AQUÍ ---
        const clientActivities = (clients || [])
            .flatMap(client => // El 'client' está disponible en este scope
                (client.activities || [])
                    .map(activity => { // Mapeamos cada actividad aquí dentro
                        if (!activity.date) {
                            console.warn("Actividad OMITIDA (sin fecha):", activity, "Cliente:", client.nombre);
                            return null; // La marcaremos para ser filtrada
                        }
                        return { // Creamos el objeto completo aquí
                            id: activity.id,
                            title: activity.description || 'Actividad',
                            details: activity.note,
                            dueDate: activity.date,
                            isCompleted: activity.completed || false,
                            clientName: client.nombre || client.name, // Ahora 'client' sí está definido
                            clientId: client.id, // Ahora 'client' sí está definido
                            type: 'activity'
                        };
                    })
            ).filter(Boolean); // Este filtro elimina todos los resultados 'null'

        const combined = [...funnelTasks, ...clientActivities];
        console.log("--- DEBUG: Lista final de todos los items combinados ---");
        console.log(combined);
        return combined;
        
    }, [clients, tasks]);

    const { today, tomorrow, twoWeeksFromNow } = useMemo(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
        const twoWeeksFromNow = new Date(today); twoWeeksFromNow.setDate(today.getDate() + 15);
        return { today, tomorrow, twoWeeksFromNow };
    }, []);

    const overdueTasks = useMemo(() => allItems.filter(item => (new Date(item.dueDate + 'T00:00:00') < today && !item.isCompleted)), [allItems, today]);
    const eventsToday = useMemo(() => allItems.filter(item => (new Date(item.dueDate + 'T00:00:00').getTime() === today.getTime() && !item.isCompleted)), [allItems, today]);
    const upcomingEvents = useMemo(() => allItems.filter(item => {
        const itemDate = new Date(item.dueDate + 'T00:00:00');
        return itemDate >= tomorrow && itemDate < twoWeeksFromNow && !item.isCompleted;
    }), [allItems, tomorrow, twoWeeksFromNow]);

    console.log("--- DEBUG: Resultado del filtrado ---");
    console.log("Tareas Vencidas:", overdueTasks);
    console.log("Tareas de Hoy:", eventsToday);
    console.log("Tareas Próximas:", upcomingEvents);

    return { overdueTasks, eventsToday, upcomingEvents };
}
