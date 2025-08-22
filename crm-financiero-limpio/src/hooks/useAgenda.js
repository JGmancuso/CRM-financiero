import { useMemo } from 'react';

// Este hook recibe la lista completa de clientes y devuelve las tareas filtradas.
export function useAgenda(clients) {
    // 1. Creamos una lista única con todas las actividades de todos los clientes
    const allTasks = useMemo(() => 
        (clients || []).flatMap(client => 
            (client.activities || []).map(activity => ({
                ...activity,
                clientName: client.nombre || client.name, // Usamos 'nombre' como principal
                clientId: client.id
            }))
        ), 
    [clients]);

    // 2. Definimos los rangos de fechas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 15);

    // 3. Filtramos las tareas en tres grupos: vencidas, de hoy y próximas
    const overdueTasks = useMemo(() => 
        allTasks.filter(task => new Date(task.date) < today && !task.completed)
             .sort((a, b) => new Date(a.date) - new Date(b.date)), 
    [allTasks, today]);
        
    const eventsToday = useMemo(() => 
        allTasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= today && taskDate < tomorrow && !task.completed;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [allTasks, today, tomorrow]);
        
    const upcomingEvents = useMemo(() => 
        allTasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= tomorrow && taskDate < twoWeeksFromNow && !task.completed;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [allTasks, tomorrow, twoWeeksFromNow]);

    // 4. El hook devuelve un objeto con las listas ya procesadas
    return { overdueTasks, eventsToday, upcomingEvents };
}