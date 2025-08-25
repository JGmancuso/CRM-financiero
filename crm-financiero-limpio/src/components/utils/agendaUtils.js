// Función para parsear una fecha YYYY-MM-DD como fecha local a medianoche
const parseDateAsLocal = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    // Le restamos 1 al mes porque en JavaScript los meses van de 0 a 11
    return new Date(year, month - 1, day);
};

// Recibe 'clientes' en lugar de 'clients'
function getUnifiedAgendaItems(clients, tasks) {
    // Las tareas del embudo y generales ya tienen el formato correcto
    const funnelTasks = (tasks || [])
        .filter(task => task.dueDate)
        .map(task => ({
            ...task,
            source: task.clientName === 'Tarea General' ? 'gestiones' : 'embudo',
        }));

    // Las actividades de cliente ahora también tienen el formato correcto,
    // solo necesitamos aplanarlas y asignarles su origen.
    const clientActivities = (clients || [])
        .flatMap(client => 
            (client.activities || [])
                .filter(activity => activity.dueDate) // Usamos dueDate
                .map(activity => ({
                    ...activity,
                    clientName: client.nombre || client.name, // Nos aseguramos que tengan el nombre del cliente
                    clientId: client.id,
                    source: 'clientes',
                }))
        );

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

    // Usamos la nueva función 'parseDateAsLocal' en todas las comparaciones
    const overdueTasks = allItems.filter(item => parseDateAsLocal(item.dueDate) < today && !item.isCompleted);
    
    const tasksByDayOfWeek = allItems.filter(item => {
        const itemDate = parseDateAsLocal(item.dueDate);
        return itemDate >= startOfWeek && itemDate <= endOfWeek && !item.isCompleted;
    }).reduce((acc, task) => {
        let day = parseDateAsLocal(task.dueDate).getDay();
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