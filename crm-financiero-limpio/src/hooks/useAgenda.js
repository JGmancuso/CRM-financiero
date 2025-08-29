import { useMemo } from 'react';
import { getUnifiedAgendaItems, categorizeTasks } from '../utils/agendaUtils';

export function useAgenda(clients, tasks, negocios, filter = 'todos', searchTerm = '') {
    
    const unifiedItems = useMemo(() => {
        return getUnifiedAgendaItems(clients, tasks, negocios);
    }, [clients, tasks, negocios]);

    const filteredItems = useMemo(() => {
        const sourceFiltered = filter === 'todos'
            ? unifiedItems
            : unifiedItems.filter(item => item.source === filter);

        if (!searchTerm) {
            return sourceFiltered;
        }
        
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        // --- 👇 LÓGICA DE BÚSQUEDA MEJORADA AQUÍ 👇 ---
        return sourceFiltered.filter(item => {
            const clientNameMatch = item.clientName?.toLowerCase().includes(lowerCaseSearchTerm);
            const titleMatch = item.title?.toLowerCase().includes(lowerCaseSearchTerm);
            const detailsMatch = item.details?.toLowerCase().includes(lowerCaseSearchTerm);

            return clientNameMatch || titleMatch || detailsMatch;
        });
        // --- 👆 FIN DE LA LÓGICA DE BÚSQUEDA 👆 ---

    }, [unifiedItems, filter, searchTerm]);

    const categorizedItems = useMemo(() => {
        return categorizeTasks(filteredItems);
    }, [filteredItems]);

    return categorizedItems;
}