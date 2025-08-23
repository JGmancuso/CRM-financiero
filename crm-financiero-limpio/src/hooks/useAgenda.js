import { useMemo } from 'react';
// Importamos las nuevas funciones de utilidad
import { getUnifiedAgendaItems, categorizeTasks } from '../utils/agendaUtils';

export function useAgenda(clients, tasks, filter = 'todos') {
    
    // Hook para unificar y filtrar por origen
    const filteredItems = useMemo(() => {
        const allItems = getUnifiedAgendaItems(clients, tasks);
        
        if (filter === 'todos') {
            return allItems;
        }
        return allItems.filter(item => item.source === filter);

    }, [clients, tasks, filter]);

    // Hook para categorizar por fecha
    const categorizedItems = useMemo(() => {
        return categorizeTasks(filteredItems);
    }, [filteredItems]);

    return categorizedItems;
}