import { useMemo } from 'react';
import { getUnifiedAgendaItems, categorizeTasks } from '../utils/agendaUtils';

// Recibe 'clientes' en lugar de 'clients'
export function useAgenda(clientes, tasks, filter = 'todos') {
    
    const filteredItems = useMemo(() => {
        // Le pasa 'clientes' a la función de utilidad
        const allItems = getUnifiedAgendaItems(clientes, tasks);
        
        if (filter === 'todos') {
            return allItems;
        }
        return allItems.filter(item => item.source === filter);

    }, [clientes, tasks, filter]); // Ahora depende de 'clientes'

    const categorizedItems = useMemo(() => {
        return categorizeTasks(filteredItems);
    }, [filteredItems]);

    return categorizedItems;
}