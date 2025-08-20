// src/views/FunnelView.js

import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useFunnel } from '../hooks/useFunnel'; // Importamos nuestro nuevo hook

// Importamos los componentes que extrajimos
import FunnelColumn from '../components/funnel/FunnelColumn';
import ManagementDetailModal from '../components/modals/ManagementDetailModal';
import StatusChangeModal from '../components/modals/StatusChangeModal';
import QualificationOutcomeModal from '../components/modals/QualificationOutcomeModal';

export default function FunnelView({ clients, sgrs, onUpdateManagementStatus, onUpdateSgrQualification }) {
    // Toda la lógica ahora vive dentro del hook. ¡El componente está limpio!
    const {
        funnelData,
        selectedClient,
        modalType,
        draggedToStatus,
        handleManageClick,
        handleAdvanceClick,
        closeModal,
        handleOnDragEnd
    } = useFunnel(clients);
    
    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <div className="p-8 h-full overflow-hidden flex flex-col bg-gray-50">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Embudo de Gestiones</h1>
                <div className="flex flex-grow space-x-4 overflow-x-auto pb-4">
                    {funnelData.map(stage => (
                        <FunnelColumn
                            key={stage.id}
                            stage={stage}
                            onManageClick={handleManageClick}
                        />
                    ))}
                </div>

                {/* La lógica de los modales sigue funcionando igual */}
                {selectedClient && modalType === 'detail' && (
                    <ManagementDetailModal 
                        client={selectedClient}
                        onClose={closeModal}
                        onAdvance={handleAdvanceClick}
                    />
                )}
                {selectedClient && modalType === 'status' && (
                    <StatusChangeModal 
                        client={selectedClient}
                        sgrs={sgrs}
                        onClose={closeModal}
                        onSave={onUpdateManagementStatus}
                        defaultStatus={draggedToStatus}
                    />
                )}
                {selectedClient && modalType === 'qualification' && (
                    <QualificationOutcomeModal
                        client={selectedClient}
                        sgrs={sgrs}
                        onClose={closeModal}
                        onSave={(updatedQualificationsArray) => {
                            onUpdateSgrQualification(selectedClient.id, updatedQualificationsArray);
                            closeModal();
                        }}
                    />
                )}
            </div>
        </DragDropContext>
    );
}