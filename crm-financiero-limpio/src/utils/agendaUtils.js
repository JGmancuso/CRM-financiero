// src/utils/agendaUtils.js

function getUnifiedAgendaItems(clients, tasks) {
    // Mapea las tareas del embudo y las tareas generales
    const generalTasks = (tasks || [])
        .filter(task => task.dueDate)
        .map(task => ({
            ...task,
            // --- 👇 LÓGICA CORREGIDA AQUÍ 👇 ---
            // Si la tarea ya tiene un origen, lo respetamos.
            // Si no, aplicamos la lógica antigua.
            source: task.source || (task.clientName === 'Gestión Activa' ? 'gestiones' : 'embudo'),
        }));

    // Mapea las actividades de los clientes (esta parte no cambia)
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

    return [...generalTasks, ...clientActivities];
}

function getWeekInfo() {
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
}

function categorizeTasks(allItems) {
    const { today, tomorrow, startOfWeek, endOfWeek, twoWeeksFromNow } = getWeekInfo();

    const overdueTasks = allItems.filter(item => new Date(item.dueDate + 'T00:00:00') < today && !item.isCompleted);
    
    const tasksByDayOfWeek = allItems.filter(item => {
        const itemDate = new Date(item.dueDate + 'T00:00:00');
        return itemDate >= startOfWeek && itemDate <= endOfWeek && !item.isCompleted;
    }).reduce((acc, task) => {
        let day = new Date(task.dueDate + 'T00:00:00').getDay();
        if (day === 0) day = 7; // Convertimos Domingo (0) a 7
        (acc[day] = acc[day] || []).push(task);
        return acc;
    }, {});

    const futureTasks = allItems.filter(item => new Date(item.dueDate + 'T00:00:00') > endOfWeek && !item.isCompleted);
    
    // Para el Dashboard
    const eventsToday = allItems.filter(item => new Date(item.dueDate + 'T00:00:00').getTime() === today.getTime() && !item.isCompleted);
    const upcomingEvents = allItems.filter(item => {
        const itemDate = new Date(item.dueDate + 'T00:00:00');
        return itemDate >= tomorrow && itemDate < twoWeeksFromNow && !item.isCompleted;
    });

    return { overdueTasks, tasksByDayOfWeek, futureTasks, eventsToday, upcomingEvents };
}

// Exportamos las funciones para que el hook las pueda usar
export { getUnifiedAgendaItems, categorizeTasks };