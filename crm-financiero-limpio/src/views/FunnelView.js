import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import QualificationAssignmentModal from '../components/modals/QualificationAssignmentModal';
import StatusChangeModal from '../components/modals/StatusChangeModal';
import StatusDetailModal from '../components/modals/StatusDetailModal';
import QualificationOutcomeModal from '../components/modals/QualificationOutcomeModal';
import { FUNNEL_STAGES } from '../data';
import { Briefcase } from 'lucide-react';

export default function FunnelView({ clients, sgrs, onNavigateToClient, onUpdateClientStatus, handleStartQualification, updateSgrOutcomes }) {
    const [showQualificationModal, setShowQualificationModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showQualificationOutcomeModal, setShowQualificationOutcomeModal] = useState(false);
    const [clientToQualify, setClientToQualify] = useState(null);
    const [clientToUpdate, setClientToUpdate] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination || source.droppableId === destination.droppableId) {
            return;
        }

        const client = clients.find(c => c.id === draggableId);
        if (client) {
            onUpdateStatusWithModal(client.id, destination.droppableId);
        }
    };
    
    const onUpdateStatusWithModal = (clientId, newStatus) => {
        const client = clients.find(c => c.id === clientId);
        setClientToUpdate(client);
        setNewStatus(newStatus);
        
        if (newStatus === FUNNEL_STAGES.in_qualification) {
            setShowQualificationModal(true);
        } else {
            setShowStatusModal(true);
        }
    };

    const handleSaveQualification = ({ sgrsToQualify }) => {
        if (clientToUpdate) {
            handleStartQualification(clientToUpdate.id, sgrsToQualify, "Calificación iniciada desde el embudo.");
            setShowQualificationModal(false);
        }
    };
    
    const handleSaveStatusChange = (notes, nextStep) => {
        if(clientToUpdate) {
            onUpdateClientStatus(clientToUpdate.id, newStatus, notes, nextStep);
            setShowStatusModal(false);
        }
    };

    const handleClientCardClick = (client) => {
        if (client.status === FUNNEL_STAGES.in_qualification) {
            setClientToUpdate(client);
            setShowQualificationOutcomeModal(true);
        } else {
            setClientToUpdate(client);
            setShowDetailModal(true);
        }
    };
    
    const handleSaveQualificationOutcomes = (updatedQualifications) => {
        if (clientToUpdate) {
            updateSgrOutcomes(clientToUpdate.id, updatedQualifications);
            setShowQualificationOutcomeModal(false);
        }
    };
    
    const groupedClients = Object.values(FUNNEL_STAGES).map(stage => ({
        id: stage,
        name: stage,
        clients: clients.filter(client => client.status === stage),
    }));
    
    const lastSubmissionDate = clientToUpdate?.qualifications?.length > 0
        ? clientToUpdate.qualifications.reduce((latest, current) => 
            new Date(current.submissionDate) > new Date(latest) ? current.submissionDate : latest, 
            clientToUpdate.qualifications[0].submissionDate
        )
        : null;

    const recentQualifications = lastSubmissionDate
        ? clientToUpdate.qualifications.filter(q => q.submissionDate === lastSubmissionDate)
        : [];
    
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="p-8 h-full overflow-hidden flex flex-col">
                <h1 className="text-3xl font-bold mb-6">Embudo de Clientes</h1>
                <div className="flex flex-grow space-x-4 overflow-x-auto">
                    {groupedClients.map(stage => (
                        <Droppable droppableId={stage.id} key={stage.id}>
                            {(provided) => (
                                <div 
                                    className="bg-gray-100 p-4 rounded-lg w-72 flex-shrink-0 flex flex-col h-full"
                                    ref={provided.innerRef} 
                                    {...provided.droppableProps}
                                >
                                    <h2 className="text-xl font-semibold mb-4 capitalize">{stage.name}</h2>
                                    <div className="space-y-4 flex-grow overflow-y-auto">
                                        {stage.clients.length > 0 ? (
                                            stage.clients.map((client, index) => (
                                                <Draggable draggableId={client.id} index={index} key={client.id}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition"
                                                            onClick={() => handleClientCardClick(client)}
                                                        >
                                                            <h3 className="font-bold text-gray-800">{client.name}</h3>
                                                            <p className="text-sm text-gray-600">{client.email}</p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-8">
                                                <Briefcase size={48} className="mx-auto mb-2" />
                                                <p>No hay clientes en esta etapa.</p>
                                            </div>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
                {showQualificationModal && (
                    <QualificationAssignmentModal
                        sgrs={sgrs}
                        onClose={() => setShowQualificationModal(false)}
                        onSave={handleSaveQualification}
                    />
                )}
                {showStatusModal && (
                    <StatusChangeModal
                        clientName={clientToUpdate.name}
                        newStatus={newStatus}
                        onClose={() => setShowStatusModal(false)}
                        onSave={handleSaveStatusChange}
                    />
                )}
                {showDetailModal && clientToUpdate && (
                    <StatusDetailModal
                        client={clientToUpdate}
                        onClose={() => setShowDetailModal(false)}
                    />
                )}
                {showQualificationOutcomeModal && clientToUpdate && (
                    <QualificationOutcomeModal
                        client={clientToUpdate}
                        onClose={() => setShowQualificationOutcomeModal(false)}
                        onSave={handleSaveQualificationOutcomes}
                    />
                )}
            </div>
        </DragDropContext>
    );
}
    
    const handleSaveStatusChange = (notes, nextStep) => {
        if(clientToUpdate) {
            onUpdateClientStatus(clientToUpdate.id, newStatus, notes, nextStep);
            setShowStatusModal(false);
        }
    };

    const handleClientCardClick = (client) => {
        if (client.status === FUNNEL_STAGES.in_qualification) {
            setClientToUpdate(client);
            setShowQualificationOutcomeModal(true);
        } else {
            setClientToUpdate(client);
            setShowDetailModal(true);
        }
    };
    
    const handleSaveQualificationOutcomes = (updatedQualifications) => {
        if (clientToUpdate) {
            updateSgrOutcomes(clientToUpdate.id, updatedQualifications);
            setShowQualificationOutcomeModal(false);
        }
    };
    
    const groupedClients = Object.values(FUNNEL_STAGES).map(stage => ({
        id: stage,
        name: stage,
        clients: clients.filter(client => client.status === stage),
    }));
    
    const lastSubmissionDate = clientToUpdate?.qualifications?.length > 0
        ? clientToUpdate.qualifications.reduce((latest, current) => 
            new Date(current.submissionDate) > new Date(latest) ? current.submissionDate : latest, 
            clientToUpdate.qualifications[0].submissionDate
        )
        : null;

    const recentQualifications = lastSubmissionDate
        ? clientToUpdate.qualifications.filter(q => q.submissionDate === lastSubmissionDate)
        : [];
    
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="p-8 h-full overflow-hidden flex flex-col">
                <h1 className="text-3xl font-bold mb-6">Embudo de Clientes</h1>
                <div className="flex flex-grow space-x-4 overflow-x-auto">
                    {groupedClients.map(stage => (
                        <Droppable droppableId={stage.id} key={stage.id}>
                            {(provided) => (
                                <div 
                                    className="bg-gray-100 p-4 rounded-lg w-72 flex-shrink-0 flex flex-col h-full"
                                    ref={provided.innerRef} 
                                    {...provided.droppableProps}
                                >
                                    <h2 className="text-xl font-semibold mb-4 capitalize">{stage.name}</h2>
                                    <div className="space-y-4 flex-grow overflow-y-auto">
                                        {stage.clients.length > 0 ? (
                                            stage.clients.map((client, index) => (
                                                <Draggable draggableId={client.id} index={index} key={client.id}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition"
                                                            onClick={() => handleClientCardClick(client)}
                                                        >
                                                            <h3 className="font-bold text-gray-800">{client.name}</h3>
                                                            <p className="text-sm text-gray-600">{client.email}</p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-8">
                                                <Briefcase size={48} className="mx-auto mb-2" />
                                                <p>No hay clientes en esta etapa.</p>
                                            </div>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
                {showQualificationModal && (
                    <QualificationAssignmentModal
                        sgrs={sgrs}
                        onClose={() => setShowQualificationModal(false)}
                        onSave={handleSaveQualification}
                    />
                )}
                {showStatusModal && (
                    <StatusChangeModal
                        clientName={clientToUpdate.name}
                        newStatus={newStatus}
                        onClose={() => setShowStatusModal(false)}
                        onSave={handleSaveStatusChange}
                    />
                )}
                {showDetailModal && clientToUpdate && (
                    <StatusDetailModal
                        client={clientToUpdate}
                        onClose={() => setShowDetailModal(false)}
                    />
                )}
                {showQualificationOutcomeModal && clientToUpdate && (
                    <QualificationOutcomeModal
                        client={clientToUpdate}
                        onClose={() => setShowQualificationOutcomeModal(false)}
                        onSave={handleSaveQualificationOutcomes}
                    />
                )}
            </div>
        </DragDropContext>
    );
}