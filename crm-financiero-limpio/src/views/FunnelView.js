import React, { useState, useEffect } from 'react';
import FunnelColumn from '../components/funnel/FunnelColumn';
import StageChangeModal from '../components/modals/StageChangeModal';
import NegocioDetailModal from '../components/modals/NegocioDetailModal';

export default function FunnelView({ negocios, sgrs, onUpdateNegocio }) {
    const [columns, setColumns] = useState({});
    const [selectedNegocio, setSelectedNegocio] = useState(null);
    const [modalData, setModalData] = useState(null); // Estado para el modal de cambio de etapa

    const FUNNEL_STAGES = {
        'PROSPECTO': 'Prospecto', 'INFO_SOLICITADA': 'Info Solicitada', 'EN_ARMADO': 'En Armado',
        'EN_CALIFICACION': 'En Calificación', 'PROPUESTA_FIRMADA': 'Propuesta Firmada',
        'GANADO': 'Ganado', 'PERDIDO': 'Perdido',
    };

    useEffect(() => {
        const newColumns = Object.keys(FUNNEL_STAGES).reduce((acc, stageKey) => { acc[stageKey] = []; return acc; }, {});
        (negocios || []).forEach(negocio => { if (newColumns[negocio.estado]) { newColumns[negocio.estado].push(negocio); } });
        setColumns(newColumns);
    }, [negocios]);

    const handleDetailSave = (updatedNegocio) => {
        onUpdateNegocio(updatedNegocio);
        setSelectedNegocio(null);
    };

    // Placeholder para la lógica de drag-and-drop que está desactivada
    const handleOnDragEnd = () => {
        console.log("Drag and drop está desactivado.");
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
                    onSave={handleDetailSave} 
                    sgrs={sgrs}
                />
            )}

            {/* Este modal solo se usará cuando reactivemos el drag and drop */}
            {modalData && (
                <StageChangeModal
                    negocio={modalData.negocio}
                    newStatusName={modalData.newStatusName}
                    onClose={() => setModalData(null)}
                    onSave={() => { /* lógica de guardado */ }}
                />
            )}
        </div>
    );
}