import React, { useState, useMemo, useEffect } from 'react';
import FunnelColumn from '../components/funnel/FunnelColumn';
import NegocioDetailModal from '../components/modals/NegocioDetailModal';
import { useData } from '../context/DataContext'; // <-- 1. Importamos el hook

// 👇 2. Eliminamos los props, ya que los obtendremos del contexto
export default function FunnelView() {
    
    const { state, dispatch } = useData(); // <-- 3. Obtenemos el estado global y dispatch
    const { negocios, sgrs } = state; // <-- Sacamos negocios y sgrs del estado

    const [columns, setColumns] = useState({});
    const [selectedNegocio, setSelectedNegocio] = useState(null);

    const FUNNEL_STAGES = {
        'PROSPECTO': 'Prospecto', 'INFO_SOLICITADA': 'Info Solicitada', 'EN_ARMADO': 'En Armado',
        'EN_CALIFICACION': 'En Calificación', 'PROPUESTA_FIRMADA': 'Propuesta Firmada',
        'GANADO': 'Ganado', 'PERDIDO': 'Perdido',
    };

    useEffect(() => {
        const newColumns = Object.keys(FUNNEL_STAGES).reduce((acc, stageKey) => { acc[stageKey] = []; return acc; }, {});
        // Usamos la variable 'negocios' que viene del estado global
        (negocios || []).forEach(negocio => { if (newColumns[negocio.estado]) { newColumns[negocio.estado].push(negocio); } });
        setColumns(newColumns);
    }, [negocios]); // El efecto ahora depende de los negocios del estado global

    // 👇 4. Creamos una nueva función que usa dispatch para guardar los cambios
    const handleUpdateNegocio = (updatedNegocio) => {
        dispatch({ type: 'UPDATE_NEGOCIO_STAGE', payload: updatedNegocio });
        setSelectedNegocio(null); // Cerramos el modal después de guardar
    };

    return (
        <div className="relative p-8 h-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Funnel de Negocios</h1>
            <div className="flex space-x-4 overflow-x-auto pb-4 h-full">
                {Object.entries(FUNNEL_STAGES).map(([columnId, columnName]) => (
                    <FunnelColumn
                        key={columnId}
                        id={columnId}
                        title={columnName}
                        negocios={columns[columnId] || []}
                        onCardClick={setSelectedNegocio}
                    />
                ))}
            </div>
            
            {selectedNegocio && (
                <NegocioDetailModal 
                    negocio={selectedNegocio} 
                    onClose={() => setSelectedNegocio(null)} 
                    // 👇 5. Le pasamos nuestra nueva función al prop 'onSave'
                    onSave={handleUpdateNegocio} 
                    sgrs={sgrs} // sgrs también viene del estado global
                />
            )}
        </div>
    );
}