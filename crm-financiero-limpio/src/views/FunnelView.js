// src/views/FunnelView.js

import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FUNNEL_STAGES } from '../data';
import { Clock, Edit } from 'lucide-react';
import InputField from '../components/common/InputField';

// --- NUEVO MODAL UNIFICADO PARA EDITAR Y GESTIONAR ---
const EditManagementModal = ({ client, sgrs, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        relevamiento: client.relevamiento || '',
        status: client.management.status,
        nextSteps: '',
        notes: '',
        sgrsToQualify: [],
        qualifications: JSON.parse(JSON.stringify(client.qualifications || []))
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleQualificationChange = (qualId, field, value) => {
        setFormData(prev => ({
            ...prev,
            qualifications: prev.qualifications.map(q =>
                q.qualificationId === qualId ? { ...q, [field]: value } : q
            )
        }));
    };

    const handleSgrSelection = (sgrName) => {
        setFormData(prev => {
            const newSgrs = prev.sgrsToQualify.includes(sgrName)
                ? prev.sgrsToQualify.filter(s => s !== sgrName)
                : [...prev.sgrsToQualify, sgrName];
            return { ...prev, sgrsToQualify: newSgrs };
        });
    };

    const handleSubmit = () => {
        if (formData.status !== client.management.status && !formData.nextSteps) {
            alert('Debes indicar los "Próximos Pasos" si cambias el estado.');
            return;
        }
        onSave(client.id, formData);
        onClose();
    };

    const availableStages = Object.values(FUNNEL_STAGES);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">Editar Gestión: {client.name}</h2>
                <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
                    <InputField label="Motivo de Contacto (Relevamiento)" name="relevamiento" as="textarea" value={formData.relevamiento} onChange={handleChange} />
                    <InputField label="Estado del Embudo" name="status" as="select" value={formData.status} onChange={handleChange}>
                        {availableStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                    </InputField>

                    {/* SECCIÓN PARA DICTAMEN SI ESTÁ "EN CALIFICACIÓN" */}
                    {formData.status === FUNNEL_STAGES.EN_CALIFICACION && (
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-semibold text-gray-800 mb-3">Dictamen de Entidades</h3>
                            <div className="space-y-4">
                                {formData.qualifications.map(qual => (
                                    <div key={qual.qualificationId} className="p-3 border rounded bg-white">
                                        <p className="font-semibold mb-2">{qual.sgrName}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputField as="select" label="Dictamen" value={qual.status || 'en_espera'} onChange={(e) => handleQualificationChange(qual.qualificationId, 'status', e.target.value)}>
                                                <option value="en_espera">En Espera</option>
                                                <option value="aprobado">Aprobado</option>
                                                <option value="rechazado">Rechazado</option>
                                            </InputField>
                                            {qual.status === 'rechazado' && <InputField label="Motivo" value={qual.reason || ''} onChange={(e) => handleQualificationChange(qual.qualificationId, 'reason', e.target.value)} />}
                                            {qual.status === 'aprobado' && <>
                                                <InputField label="Monto Aprobado" type="number" value={qual.amount || ''} onChange={(e) => handleQualificationChange(qual.qualificationId, 'amount', e.target.value)} />
                                                <InputField label="Vencimiento" type="date" value={qual.dueDate || ''} onChange={(e) => handleQualificationChange(qual.qualificationId, 'dueDate', e.target.value)} />
                                                <InputField label="Destino" value={qual.destination || ''} onChange={(e) => handleQualificationChange(qual.qualificationId, 'destination', e.target.value)} />
                                            </>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* SECCIÓN PARA AVANZAR A "EN CALIFICACIÓN" */}
                    {formData.status === FUNNEL_STAGES.EN_CALIFICACION && client.management.status !== FUNNEL_STAGES.EN_CALIFICACION && (
                         <div className="p-4 border rounded-lg bg-gray-50">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Entidades a Calificar</label>
                            <div className="space-y-2">
                                {(sgrs || []).map(sgr => (
                                    <label key={sgr.id} className="flex items-center"><input type="checkbox" onChange={() => handleSgrSelection(sgr.name)} className="h-4 w-4" /><span className="ml-2">{sgr.name}</span></label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN PARA NOTAS SI SE CAMBIA EL ESTADO */}
                    {formData.status !== client.management.status && (
                        <div className="p-4 border rounded-lg bg-gray-50">
                             <InputField label="Próximos Pasos (requerido al cambiar estado)" name="nextSteps" value={formData.nextSteps} onChange={handleChange} />
                             <InputField label="Notas Adicionales" name="notes" as="textarea" value={formData.notes} onChange={handleChange} />
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button type="button" onClick={handleSubmit} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};


export default function FunnelView({ clients, sgrs, onUpdateManagement, onNavigateToClient }) {
    const [selectedClient, setSelectedClient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = (client) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedClient(null);
    };

    const funnelData = useMemo(() => {
        const stages = Object.values(FUNNEL_STAGES);
        const grouped = stages.reduce((acc, stage) => ({ ...acc, [stage]: [] }), {});
        (clients || []).forEach(client => {
            if (client.management && grouped.hasOwnProperty(client.management.status)) {
                grouped[client.management.status].push(client);
            }
        });
        return stages.map(stage => ({ id: stage, name: stage.replace(/_/g, ' '), clients: grouped[stage] }));
    }, [clients]);
    
    return (
        <DragDropContext onDragEnd={() => {}}>
            <div className="p-8 h-full overflow-hidden flex flex-col bg-gray-50">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Embudo de Gestiones</h1>
                <div className="flex flex-grow space-x-4 overflow-x-auto pb-4">
                    {funnelData.map(stage => (
                        <Droppable droppableId={stage.id} key={stage.id}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-200 p-4 rounded-lg w-80 flex-shrink-0 flex flex-col h-full">
                                    <h2 className="text-xl font-semibold mb-4 capitalize text-gray-700">{stage.name}</h2>
                                    <div className="space-y-2 flex-grow overflow-y-auto px-1">
                                        {stage.clients.map((client, index) => {
                                            const history = client.management.history;
                                            let daysInStage = 0;
                                            if (history && history.length > 0) {
                                                const lastEventDate = new Date(history[history.length - 1].date);
                                                const today = new Date();
                                                daysInStage = Math.floor((today - lastEventDate) / (1000 * 60 * 60 * 24));
                                            }

                                            return (
                                                <Draggable key={client.management.id} draggableId={client.management.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition relative"
                                                        >
                                                            <div className="absolute top-2 right-2 bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                                                <Clock size={12} className="mr-1" />{daysInStage}d
                                                            </div>
                                                            <h3 className="font-bold text-gray-800 pr-10 cursor-pointer hover:text-blue-600" onClick={() => onNavigateToClient(client)}>
                                                                {client.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mt-1 italic">
                                                                {client.relevamiento || 'Sin motivo de contacto'}
                                                            </p>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleEditClick(client); }}
                                                                className="mt-3 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 self-start flex items-center"
                                                            >
                                                                <Edit size={14} className="mr-2"/> Editar Gestión
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
                {isModalOpen && selectedClient && (
                    <EditManagementModal 
                        client={selectedClient}
                        sgrs={sgrs}
                        onClose={closeModal}
                        onSave={onUpdateManagement}
                    />
                )}
            </div>
        </DragDropContext>
    );
}