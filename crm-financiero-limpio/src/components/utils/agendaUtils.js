// Función para parsear una fecha YYYY-MM-DD como fecha local a medianoche
const parseDateAsLocal = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

function getUnifiedAgendaItems(clients, tasks) {
    const funnelTasks = (tasks || [])
        .filter(task => task.dueDate)
        .map(task => ({
            ...task,
            source: task.clientName === 'Tarea General' ? 'gestiones' : 'embudo',
        }));

    const clientActivities = (clients || [])
        .flatMap(client => 
            (client.activities || [])
                .map(activity => {
                    const validDate = activity.date || activity.dueDate;
                    if (!validDate) return null;
                    
                    return {
                        id: activity.id,
                        title: activity.description || activity.title || 'Actividad',
                        details: activity.note || activity.details,
                        dueDate: validDate.split('T')[0],
                        isCompleted: activity.completed || activity.isCompleted || false,
                        clientName: client.nombre || client.name,
                        clientId: client.id,
                        type: 'activity',
                        source: 'clientes',
                    };
                })
        ).filter(Boolean); 
    return [...funnelTasks, ...clientActivities];
}

function getWeekInfo() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
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

    const overdueTasks = allItems.filter(item => parseDateAsLocal(item.dueDate) < today && !item.isCompleted);
    
    const tasksByDayOfWeek = allItems.filter(item => {
        const itemDate = parseDateAsLocal(item.dueDate);
        return itemDate >= startOfWeek && itemDate <= endOfWeek && !item.isCompleted;
    }).reduce((acc, task) => {
        const itemDate = parseDateAsLocal(task.dueDate);
        let day = itemDate.getDay();
        if (day === 0) day = 7;
        (acc[day] = acc[day] || []).push(task);
        return acc;
    }, {});

    const futureTasks = allItems.filter(item => parseDateAsLocal(item.dueDate) > endOfWeek && !item.isCompleted);
    const eventsToday = allItems.filter(item => parseDateAsLocal(item.dueDate)?.getTime() === today.getTime() && !item.isCompleted);
    const upcomingEvents = allItems.filter(item => {
        const itemDate = parseDateAsLocal(item.dueDate);
        return itemDate >= tomorrow && itemDate < twoWeeksFromNow && !item.isCompleted;
    });

    return { overdueTasks, tasksByDayOfWeek, futureTasks, eventsToday, upcomingEvents };
}

export { getUnifiedAgendaItems, categorizeTasks };