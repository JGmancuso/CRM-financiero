console.log("¡¡¡ EL ARCHIVO agendaUtils.js SE ESTÁ CARGANDO !!!");

function getUnifiedAgendaItems(clients, tasks) {
    console.groupCollapsed("--- DEBUG: Paso 1 - Unificación de Datos ---");
    console.log("Datos brutos - Tasks (del embudo):", tasks);
    console.log("Datos brutos - Clients (con actividades):", clients);

    const funnelTasks = (tasks || [])
        .filter(task => task.dueDate)
        .map(task => ({
            ...task,
            source: task.clientName === 'Tarea General' ? 'gestiones' : 'embudo',
        }));
    console.log("Items procesados (Embudo/Gestiones):", funnelTasks);

    const clientActivities = (clients || [])
        .flatMap(client => 
            (client.activities || []).map(activity => {
                if (!activity.date) {
                    console.warn("Actividad OMITIDA (sin fecha):", activity, "Cliente:", client.nombre);
                    return null;
                }
                return {
                    id: activity.id, title: activity.description || 'Actividad', details: activity.note,
                    dueDate: activity.date, isCompleted: activity.completed || false,
                    clientName: client.nombre || client.name, clientId: client.id,
                    type: 'activity', source: 'clientes',
                };
            })
        ).filter(Boolean);
    console.log("Items procesados (Clientes):", clientActivities);

    const combined = [...funnelTasks, ...clientActivities];
    console.log("Lista combinada ANTES de filtrar por origen:", combined);
    console.groupEnd();
    return combined;
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