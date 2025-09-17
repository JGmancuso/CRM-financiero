import React, { useState, useMemo } from 'react';
import FunnelColumn from '../components/funnel/FunnelColumn';
import NegocioDetailModal from '../components/modals/NegocioDetailModal';
import { useData } from '../context/DataContext';
import { Search } from 'lucide-react';
import { daysSince, findLastStageChangeDate } from '../utils/negocioUtils';

export default function FunnelView() {
    const { state, dispatch } = useData();
    const { negocios, sgrs: allEntities } = state;
    
    const [selectedNegocio, setSelectedNegocio] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entityFilter, setEntityFilter] = useState('TODAS');


    const FUNNEL_STAGES = {
        'PROSPECTO': 'Prospecto', 'INFO_SOLICITADA': 'Info Solicitada', 'EN_ARMADO': 'En Armado',
        'EN_CALIFICACION': 'En Calificación', 'PROPUESTA_FIRMADA': 'Propuesta Firmada',
        'GANADO': 'Ganado', 'PERDIDO': 'Perdido',
    };

    const negociosAgrupados = useMemo(() => {
        // --- LÓGICA DE FILTRADO Y AGRUPACIÓN CORREGIDA ---
        
        // 1. Filtramos por palabra clave
        let filteredNegocios = (negocios || []).filter(negocio => {
            if (!searchTerm.trim()) return true;
            const lowerCaseSearch = searchTerm.toLowerCase();
            return (negocio.nombre || '').toLowerCase().includes(lowerCaseSearch) ||
                   (negocio.cliente?.nombre || negocio.cliente?.name || '').toLowerCase().includes(lowerCaseSearch);
        });

        // 2. Filtramos por entidad
        if (entityFilter !== 'TODAS') {
            filteredNegocios = filteredNegocios.filter(negocio => {
                if (!negocio.calificaciones || negocio.calificaciones.length === 0) return false;
                return negocio.calificaciones.some(cal => (cal.entidad || cal.sgrName) === entityFilter);
            });
        }
        
        // 3. Agrupamos los negocios ya filtrados en sus columnas
        const negociosPorEtapa = {};
        const stageKeys = Object.keys(FUNNEL_STAGES);
        stageKeys.forEach(stage => {
            negociosPorEtapa[stage] = filteredNegocios.filter(n => n.estado === stage);
        });

        // 4. Para cada etapa, agrupamos por cliente y ordenamos
        const finalStructure = {};
        stageKeys.forEach(stage => {
            const byClient = {};
            negociosPorEtapa[stage].forEach(negocio => {
                const clientName = negocio.cliente?.nombre || negocio.cliente?.name || 'Sin Cliente Asignado';
                if (!byClient[clientName]) {
                    byClient[clientName] = { clientName, negocios: [] };
                }
                byClient[clientName].negocios.push(negocio);
            });

            let clientGroups = Object.values(byClient);
            clientGroups.forEach(group => {
                group.negocios.sort((a, b) => daysSince(findLastStageChangeDate(b)) - daysSince(findLastStageChangeDate(a)));
                group.maxDiasEnEstado = group.negocios.length > 0 ? daysSince(findLastStageChangeDate(group.negocios[0])) : 0;
            });
            clientGroups.sort((a, b) => b.maxDiasEnEstado - a.maxDiasEnEstado);
            finalStructure[stage] = clientGroups;
        });

        return finalStructure;

    }, [negocios, searchTerm, entityFilter]);

    const handleUpdateNegocio = (updatedNegocio) => {
        dispatch({ type: 'UPDATE_NEGOCIO_STAGE', payload: updatedNegocio });
        setSelectedNegocio(null);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="p-4 border-b bg-white flex justify-between items-center flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-800">Embudo de Negocios</h1>
                <div className="flex items-center space-x-4">
                    {/* --- 👇 NUEVO FILTRO DESPLEGABLE 👇 --- */}
                    <select 
                        value={entityFilter}
                        onChange={(e) => setEntityFilter(e.target.value)}
                        className="border rounded-full px-4 py-2 text-sm bg-white"
                    >
                        <option value="TODAS">Filtrar por Entidad...</option>
                        {(allEntities || []).map(entity => (
                            <option key={entity.id} value={entity.name}>{entity.name}</option>
                        ))}
                    </select>

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
                    sgrs={allEntities} 
                />
            )}
        </div>
    );
}