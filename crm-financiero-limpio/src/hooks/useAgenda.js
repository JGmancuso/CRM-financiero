import { useMemo } from 'react';
import { getUnifiedAgendaItems, categorizeTasks } from '../utils/agendaUtils';

export function useAgenda(clients, tasks, filter = 'todos') {
    
    const filteredItems = useMemo(() => {
        const allItems = getUnifiedAgendaItems(clients, tasks);
        if (filter === 'todos') {
            return allItems;
        }
        return allItems.filter(item => item.source === filter);
    }, [clients, tasks, filter]);

    const categorizedItems = useMemo(() => {
        return categorizeTasks(filteredItems);
    }, [filteredItems]);

    return categorizedItems;
}