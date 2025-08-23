import { useMemo } from 'react';
// Importamos las funciones de utilidad desde el nuevo archivo
import { getUnifiedAgendaItems, categorizeTasks } from '../utils/agendaUtils';

export function useAgenda(clients, tasks, filter = 'todos') {
    
    // Paso 1: Unifica todos los items (tareas y actividades) y aplica el filtro de origen.
    const filteredItems = useMemo(() => {
        const allItems = getUnifiedAgendaItems(clients, tasks);
        
        if (filter === 'todos') {
            return allItems;
        }
        return allItems.filter(item => item.source === filter);

    }, [clients, tasks, filter]);

    // Paso 2: Toma los items ya filtrados y los categoriza por fecha.
    const categorizedItems = useMemo(() => {
        return categorizeTasks(filteredItems);
    }, [filteredItems]);

    // Devuelve el resultado final a la vista.
    return categorizedItems;
}