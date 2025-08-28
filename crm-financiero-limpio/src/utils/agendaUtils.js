// src/utils/agendaUtils.js

function getUnifiedAgendaItems(clients, tasks, negocios) {
    // Tareas del embudo y gestiones
    const generalTasks = (tasks || [])
        .filter(task => task.dueDate)
        .map(task => {
            let enrichedTask = {
                ...task,
                source: task.source || (task.clientName === 'Gestión Activa' ? 'gestiones' : 'embudo'),
            };

            if (task.businessId) {
                // --- 👇 LÍNEA CORREGIDA AQUÍ 👇 ---
                // Nos aseguramos de que 'negocios' sea un array antes de usar .find()
                const negocioAsociado = (negocios || []).find(n => n.id === task.businessId);
                if (negocioAsociado) {
                    enrichedTask.businessInfo = {
                        observaciones: negocioAsociado.motivoUltimoCambio,
                        calificacionesSGR: negocioAsociado.calificaciones,
                    };
                }
            }
            return enrichedTask;
        });

    // Actividades de clientes (no cambian)
    const clientActivities = (clients || [])
        .flatMap(client => 
            (client.activities || []).map(activity => ({
                id: activity.id,
                title: activity.description || 'Actividad',
                details: activity.note,
                dueDate: activity.date,
                isCompleted: activity.completed || false,
                clientName: client.nombre || client.name,
                clientId: client.id,
                source: 'clientes',
            }))
        );

    return [...generalTasks, ...clientActivities];
}
export function categorizeTasksForDashboard(allItems) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const overdue = allItems.filter(item => new Date(item.dueDate) < today && !item.isCompleted);
    const forToday = allItems.filter(item => new Date(item.dueDate).getTime() === today.getTime() && !item.isCompleted);
    const upcoming = allItems.filter(item => new Date(item.dueDate) >= tomorrow && !item.isCompleted);

    return { overdue, forToday, upcoming };
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