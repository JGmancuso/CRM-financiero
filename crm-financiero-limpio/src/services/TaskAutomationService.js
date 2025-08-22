/**
 * Este servicio contiene la lógica de negocio para crear tareas automáticamente
 * basadas en los cambios de estado de un negocio en el funnel.
 */
export const createTaskForStageChange = (negocio) => {
    // ✨ NUEVA LÓGICA: Ahora usamos los datos detallados del negocio
    let taskTitle = '';
    
    // Si el usuario especificó "próximos pasos", esa es la mejor descripción para la tarea.
    if (negocio.proximosPasos) {
        taskTitle = `${negocio.proximosPasos} - [${negocio.cliente.nombre}]`;
    } 
    // Si no, usamos el motivo del cambio.
    else if (negocio.motivoUltimoCambio) {
        taskTitle = `${negocio.motivoUltimoCambio} - [${negocio.cliente.nombre}]`;
    }
    // Si no hay ninguno, volvemos a la lógica genérica.
    else {
        taskTitle = `Hacer seguimiento de etapa '${negocio.estado}' para ${negocio.cliente.nombre}`;
    }

    const followUpDate = new Date();
    followUpDate.setHours(10, 0, 0, 0);
    followUpDate.setDate(followUpDate.getDate() + 3); // Por defecto, 3 días para seguimiento

    // Devolvemos el objeto con los datos de la tarea a crear
    return {
        title: taskTitle,
        dueDate: followUpDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        clientId: negocio.cliente.id,
        businessId: negocio.id,
        clientName: negocio.cliente.nombre,
        // ✨ Añadimos el detalle completo para usarlo en la Agenda
        details: negocio.motivoUltimoCambio || 'Sin detalles adicionales.', 
    };
};