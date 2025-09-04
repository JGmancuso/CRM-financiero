// src/utils/agendaUtils.js

// La función principal ahora pasa más datos del negocio a la tarea
function getUnifiedAgendaItems(clients, tasks, negocios) {
    const generalTasks = (tasks || [])
        .filter(task => task.dueDate)
        .map(task => {
            let enrichedTask = {
                ...task,
                source: task.source || (task.clientName === 'Gestión Activa' ? 'gestiones' : 'embudo'),
            };

            // Si la tarea está vinculada a un negocio, enriquecemos la información
            if (task.businessId) {
                const negocioAsociado = (negocios || []).find(n => n.id === task.businessId);
                if (negocioAsociado) {
                    enrichedTask.businessInfo = {
                        estado: negocioAsociado.estado,
                        monto: negocioAsociado.montoSolicitado,
                        moneda: negocioAsociado.moneda || 'ARS',
                        observaciones: negocioAsociado.motivoUltimoCambio,
                        calificacionesSGR: negocioAsociado.calificaciones,
                    };
                }
            }
            return enrichedTask;
        });

    const clientActivities = (clients || [])
        .flatMap(client => 
            (client.activities || []).map(activity => ({
                id: activity.id,
                title: activity.description || 'Actividad',
                details: activity.note,
                dueDate: activity.dueDate || activity.date,
                isCompleted: activity.completed || false,
                clientName: client.nombre || client.name,
                clientId: client.id,
                source: 'clientes',
            }))
        );

    return [...generalTasks, ...clientActivities].filter(item => item.dueDate);
}

export function categorizeTasksForDashboard(allItems) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const overdue = allItems.filter(item => new Date(item.dueDate + 'T00:00:00') < today && !item.isCompleted);
    const forToday = allItems.filter(item => new Date(item.dueDate + 'T00:00:00').getTime() === today.getTime() && !item.isCompleted);
    const upcoming = allItems.filter(item => new Date(item.dueDate + 'T00:00:00') >= tomorrow && !item.isCompleted);

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

    // 1. Tareas Vencidas: Aquellas cuya fecha es ANTERIOR a hoy y no están completas.
    const overdueTasks = allItems.filter(item => new Date(item.dueDate + 'T00:00:00') < today && !item.isCompleted);
    
    // 2. Tareas por Día de la Semana: Aquellas DENTRO de la semana actual pero A PARTIR DE HOY.
    const tasksByDayOfWeek = allItems.filter(item => {
        const itemDate = new Date(item.dueDate + 'T00:00:00');
        // --- 👇 LÍNEA CORREGIDA AQUÍ 👇 ---
        // Nos aseguramos de que la fecha sea igual o posterior a hoy.
        return itemDate >= today && itemDate <= endOfWeek && !item.isCompleted;
    }).reduce((acc, task) => {
        let day = new Date(task.dueDate + 'T00:00:00').getDay();
        if (day === 0) day = 7; // Convertimos Domingo (0) a 7 para el orden
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