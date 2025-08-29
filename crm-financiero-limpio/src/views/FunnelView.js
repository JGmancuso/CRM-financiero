import React, { useState, useMemo } from 'react';
import FunnelColumn from '../components/funnel/FunnelColumn';
import NegocioDetailModal from '../components/modals/NegocioDetailModal';
import { useData } from '../context/DataContext';
import { Search } from 'lucide-react';
import { daysSince, findLastStageChangeDate } from '../utils/negocioUtils';

export default function FunnelView() {
    const { state, dispatch } = useData();
    const { negocios, sgrs } = state;
    
    const [selectedNegocio, setSelectedNegocio] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const FUNNEL_STAGES = {
        'PROSPECTO': 'Prospecto', 'INFO_SOLICITADA': 'Info Solicitada', 'EN_ARMADO': 'En Armado',
        'EN_CALIFICACION': 'En Calificación', 'PROPUESTA_FIRMADA': 'Propuesta Firmada',
        'GANADO': 'Ganado', 'PERDIDO': 'Perdido',
    };

    const negociosAgrupados = useMemo(() => {
        // --- 👇 LÓGICA DE AGRUPACIÓN Y ORDENAMIENTO REESCRITA 👇 ---
        const finalStructure = {};
        const stageKeys = Object.keys(FUNNEL_STAGES);

        // Inicializamos la estructura final para cada estado
        stageKeys.forEach(stage => { finalStructure[stage] = []; });

        // 1. Filtramos todos los negocios según el término de búsqueda
        const filteredNegocios = (negocios || []).filter(negocio => {
            if (!searchTerm.trim()) return true;
            const lowerCaseSearch = searchTerm.toLowerCase();
            const nombreNegocio = (negocio.nombre || '').toLowerCase();
            const nombreCliente = (negocio.cliente?.nombre || negocio.cliente?.name || '').toLowerCase();
            return nombreNegocio.includes(lowerCaseSearch) || nombreCliente.includes(lowerCaseSearch);
        });

        // 2. Agrupamos los negocios filtrados en sus respectivas columnas de estado
        const negociosPorEtapa = {};
        stageKeys.forEach(stage => {
            negociosPorEtapa[stage] = filteredNegocios.filter(n => n.estado === stage);
        });

        // 3. Para cada estado, agrupamos los negocios por cliente
        stageKeys.forEach(stage => {
            const byClient = {}; // Objeto temporal para agrupar
            negociosPorEtapa[stage].forEach(negocio => {
                const clientName = negocio.cliente?.nombre || negocio.cliente?.name || 'Sin Cliente Asignado';
                if (!byClient[clientName]) {
                    // Creamos el grupo para el cliente si no existe
                    byClient[clientName] = { clientName, negocios: [] };
                }
                byClient[clientName].negocios.push(negocio);
            });

            // Convertimos el objeto de grupos en un array
            let clientGroups = Object.values(byClient);

            // 4. Calculamos antigüedad y ordenamos los negocios DENTRO de cada grupo
            clientGroups.forEach(group => {
                group.negocios.sort((a, b) => {
                    const diasB = daysSince(findLastStageChangeDate(b));
                    const diasA = daysSince(findLastStageChangeDate(a));
                    return diasB - diasA; // de mayor a menor
                });
                // La antigüedad del grupo es la de su negocio más antiguo
                group.maxDiasEnEstado = group.negocios.length > 0
                    ? daysSince(findLastStageChangeDate(group.negocios[0]))
                    : 0;
            });

            // 5. Ordenamos los GRUPOS de clientes por su antigüedad
            clientGroups.sort((a, b) => b.maxDiasEnEstado - a.maxDiasEnEstado);

            finalStructure[stage] = clientGroups;
        });

        return finalStructure;
        

    }, [negocios, searchTerm]);

    const handleUpdateNegocio = (updatedNegocio) => {
        dispatch({ type: 'UPDATE_NEGOCIO_STAGE', payload: updatedNegocio });
        setSelectedNegocio(null);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="p-4 border-b bg-white flex justify-between items-center flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-800">Embudo de Negocios</h1>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Buscar por negocio o cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-full bg-white text-sm"
                    />
                </div>
            </header>
            <main className="flex-1 overflow-x-auto p-4">
                <div className="flex space-x-4 h-full">
                    {Object.entries(FUNNEL_STAGES).map(([key, title]) => (
                        <FunnelColumn 
                            key={key} 
                            id={key}
                            title={title} 
                            businessGroups={negociosAgrupados[key] || []}
                            onCardClick={setSelectedNegocio}
                        />
                    ))}
                </div>
            </main>

            {selectedNegocio && (
                <NegocioDetailModal 
                    negocio={selectedNegocio}
                    onSave={handleUpdateNegocio} 
                    onClose={() => setSelectedNegocio(null)}
                    sgrs={sgrs}
                />
            )}
        </div>
    );
}