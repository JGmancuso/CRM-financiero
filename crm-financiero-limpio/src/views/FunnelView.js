import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useFunnel } from '../hooks/useFunnel';
import FunnelColumn from '../components/funnel/FunnelColumn';
//import FunnelStatusModal from '../components/modals/FunnelStatusModal';

import StageChangeModal from '../components/modals/StageChangeModal';
export default function FunnelView({ negocios, sgrs, onUpdateNegocio, onUpdateSgrQualification }) {
    
    const { 
        columns, 
        handleOnDragEnd, 
        modalData, 
        handleModalSave, 
        handleModalClose 
    } = useFunnel(negocios, onUpdateNegocio);

    return (
        <div className="relative p-8 h-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Funnel de Negocios</h1>
            
            <div className="flex space-x-4 overflow-x-auto pb-4 h-full">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    {Object.entries(columns).map(([columnId, column]) => (
                        <FunnelColumn
                            key={columnId}
                            columnId={columnId}
                            column={column}
                            sgrs={sgrs}
                            onUpdateSgrQualification={onUpdateSgrQualification}
                            onUpdateNegocio={onUpdateNegocio} 
                        />
                    ))}
                </DragDropContext>
            </div>

            {/* 👇 CAMBIO REALIZADO AQUÍ */}
            {modalData && (
                <StageChangeModal
                    negocio={modalData.negocio}
                    newStatusName={modalData.newStatusName}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                />
            )}  
        </div>
    );
}