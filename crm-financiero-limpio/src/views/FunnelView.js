import React, { useState } from 'react';
import { FUNNEL_STAGES, initialSGRs } from '../data';
import FunnelStatusModal from '../components/modals/FunnelStatusModal';
import QualificationAssignmentModal from '../components/modals/QualificationAssignmentModal';

export default function FunnelView({ clients, onUpdateClient, sgrs, onNavigateToClient }) {
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isQualificationModalOpen, setIsQualificationModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const columns = Object.values(FUNNEL_STAGES);

    const handleStatusChangeRequest = (client, status) => {
        setSelectedClient(client);
        setNewStatus(status);
        if (status === FUNNEL_STAGES.in_qualification) {
            setIsQualificationModalOpen(true);
        } else {
            setIsStatusModalOpen(true);
        }
    };
    
    const handleSaveStatusChange = (formData) => {
        const { reason, nextSteps, missingItems } = formData;
        const newHistoryEntry = {
            date: new Date().toISOString(),
            oldStatus: selectedClient.status,
            newStatus: newStatus,
            reason: reason,
            type: 'Funnel Change'
        };
        
        let newActivities = [];
        if (nextSteps) {
            newActivities.push({
                id: `a${Date.now()}-nextsteps`,
                type: 'task',
                title: `Paso a seguir: ${nextSteps}`,
                date: new Date().toISOString(),
                note: `Relacionado al cambio de estado a "${newStatus}". Motivo: ${reason}`,
                completed: false
            });
        }
        if (missingItems) {
            newActivities.push({
                id: `a${Date.now()}-missing`,
                type: 'task',
                title: `Solicitar Faltante: ${missingItems}`,
                date: new Date().toISOString(),
                note: `Relacionado al cambio de estado a "${newStatus}". Motivo: ${reason}`,
                completed: false
            });
        }

        const updatedClient = {
            ...selectedClient,
            status: newStatus,
            history: [...(selectedClient.history || []), newHistoryEntry],
            activities: [...(selectedClient.activities || []), ...newActivities],
            lastUpdate: new Date().toISOString()
        };

        onUpdateClient(updatedClient);
        setIsStatusModalOpen(false);
    };
    
    const handleSaveQualificationAssignment = ({ sgrsToQualify }) => {
        let newActivities = [];
        sgrsToQualify.forEach(sgrName => {
            newActivities.push({
                id: `a${Date.now()}-${sgrName}`,
                type: 'task',
                title: `Seguimiento Calificación: ${sgrName}`,
                date: new Date().toISOString(),
                note: `Enviar y hacer seguimiento de la carpeta en ${sgrName}.`,
                completed: false
            });
        });

        const updatedClient = {
            ...selectedClient,
            status: FUNNEL_STAGES.in_qualification,
            activities: [...(selectedClient.activities || []), ...newActivities],
            lastUpdate: new Date().toISOString()
        };
        onUpdateClient(updatedClient);
        setIsQualificationModalOpen(false);
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Embudo de Clientes</h1>
            <div className="flex-1 flex space-x-4 overflow-x-auto pb-4">
                {columns.map(stage => (
                    <div key={stage} className="w-72 bg-gray-200 rounded-lg p-3 flex-shrink-0">
                        <h3 className="font-semibold text-gray-700 mb-4 px-1">{stage}</h3>
                        <div className="space-y-3 h-full overflow-y-auto">
                            {clients.filter(c => c.status === stage).map(client => (
                                <div key={client.id} className="bg-white p-4 rounded-lg shadow cursor-pointer" onClick={() => onNavigateToClient(client)}>
                                    <p className="font-bold text-gray-800">{client.name}</p>
                                    <p className="text-sm text-gray-500">{client.industry}</p>
                                    <div className="mt-2">
                                        <select 
                                            value={client.status} 
                                            onChange={(e) => { e.stopPropagation(); handleStatusChangeRequest(client, e.target.value); }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full text-xs p-1 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {columns.map(col => <option key={col} value={col}>{col}</option>)}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {isStatusModalOpen && <FunnelStatusModal client={selectedClient} newStatus={newStatus} onClose={() => setIsStatusModalOpen(false)} onSave={handleSaveStatusChange} />}
            {isQualificationModalOpen && <QualificationAssignmentModal sgrs={sgrs} onClose={() => setIsQualificationModalOpen(false)} onSave={handleSaveQualificationAssignment} />}
        </div>
    );
}