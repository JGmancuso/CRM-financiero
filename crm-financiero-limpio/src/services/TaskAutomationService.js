// src/services/TaskAutomationService.js

/**
 * Calcula el siguiente día hábil a partir de hoy, saltando fines de semana.
 * @returns {Date}
 */
function getNextBusinessDay() {
    const today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayOfWeek = tomorrow.getDay(); // 0 = Domingo, 6 = Sábado

    if (dayOfWeek === 6) { // Si es Sábado
        tomorrow.setDate(tomorrow.getDate() + 2); // Salta al Lunes
    } else if (dayOfWeek === 0) { // Si es Domingo
        tomorrow.setDate(tomorrow.getDate() + 1); // Salta al Lunes
    }

    return tomorrow;
}

/**
 * Orquesta la automatización de la agenda cuando un negocio cambia de estado.
 * @param {object} originalNegocio - El objeto del negocio ANTES del cambio.
 * @param {object} updatedNegocio - El objeto del negocio DESPUÉS del cambio.
 * @param {Array} allTasks - La lista completa de tareas actuales.
 * @returns {{updatedTasks: Array, newNegocio: object}}
 */
export function handleStageChangeAutomation(originalNegocio, updatedNegocio, allTasks) {
    // 1. Marcar TODAS las tareas anteriores de este negocio como completadas.
    // Usamos .map() para revisar cada tarea en la lista.
    let tasksAfterUpdate = allTasks.map(task => {
        // Si la tarea está pendiente y pertenece al negocio que cambió de estado...
        if (!task.isCompleted && task.businessId === originalNegocio.id) {
            // ...la devolvemos marcada como completada.
            return { ...task, isCompleted: true };
        }
        // Si no, la devolvemos sin cambios.
        return task;
    });

    // --- 2. Generar nueva tarea con título inteligente (TU LÓGICA) ---
    // --- 👇 LÓGICA DEL TÍTULO CORREGIDA AQUÍ 👇 ---
    // El título ahora siempre sigue el formato estándar [ESTADO] - NOMBRE CLIENTE
    const clientName = updatedNegocio.cliente.nombre || updatedNegocio.cliente.name;
    const taskTitle = `[${updatedNegocio.estado}] - ${clientName}`;
    // --- 👆 FIN DE LA CORRECCIÓN ---

    const newDueDate = getNextBusinessDay().toISOString().split('T')[0];

    const newTask = {
        id: `task-auto-${Date.now()}`,
        title: taskTitle,
        dueDate: newDueDate,
        isCompleted: false,
        source: 'embudo',
        businessId: updatedNegocio.id, // Vinculamos la tarea al negocio
        clientId: updatedNegocio.cliente.id,
        clientName: clientName,
        details: updatedNegocio.motivoUltimoCambio || 'Sin detalles adicionales.',
    };
    
    tasksAfterUpdate.push(newTask);
    
    return { 
        updatedTasks: tasksAfterUpdate,
        newNegocio: { ...updatedNegocio, activeTaskId: newTask.id }
    };
}