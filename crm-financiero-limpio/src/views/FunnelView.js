// src/views/FunnelView.js
import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FUNNEL_STAGES } from '../data';
import { Briefcase, Edit, ArrowRight } from 'lucide-react';

// --- MODAL PARA VER DETALLES E HISTORIAL ---
const ManagementDetailModal = ({ client, onClose, onAdvance }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-xl">
                <h2 className="text-2xl font-bold mb-4">Historial de Gestión: {client.name}</h2>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {client.management.history.map((entry, index) => (
                        <div key={index} className="border-l-4 pl-4 py-2 border-blue-500">
                            <p className="font-semibold text-gray-800">{entry.status}</p>
                            <p className="text-sm text-gray-600"><strong>Próximos Pasos:</strong> {entry.nextSteps || 'N/A'}</p>
                            <p className="text-sm text-gray-600"><strong>Notas:</strong> {entry.notes || 'N/A'}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(entry.date).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-between items-center">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cerrar</button>
                    <button onClick={onAdvance} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
                        Avanzar Gestión <ArrowRight size={16} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- MODAL PARA CAMBIO DE ESTADO GENERAL ---
const StatusChangeModal = ({ client, sgrs, onClose, onSave }) => {
    const [nextStatus, setNextStatus] = useState('');
    const [nextSteps, setNextSteps] = useState('');
    const [notes, setNotes] = useState('');
    const [sgrsToQualify, setSgrsToQualify] = useState([]);

    const handleSave = () => {
        if (!nextStatus || !nextSteps) {
            alert("Por favor, complete el próximo estado y los próximos pasos.");
            return;
        }
        if (nextStatus === FUNNEL_STAGES.EN_CALIFICACION && sgrsToQualify.length === 0) {
            alert("Por favor, seleccione al menos una SGR para enviar a calificación.");
            return;
        }
        onSave(client.id, nextStatus, { nextSteps, notes, sgrsToQualify });
        onClose();
    };

    const handleSgrSelection = (sgrName) => {
        setSgrsToQualify(prev => 
            prev.includes(sgrName) ? prev.filter(s => s !== sgrName) : [...prev, sgrName]
        );
    };

    const availableStages = Object.values(FUNNEL_STAGES).filter(s => 
        s !== FUNNEL_STAGES.GANADO && s !== FUNNEL_STAGES.PERDIDO
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Cambiar Estado: {client.name}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Próximo Estado</label>
                        <select onChange={(e) => setNextStatus(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Seleccione un estado...</option>
                            {availableStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Próximos Pasos</label>
                        <input type="text" value={nextSteps} onChange={(e) => setNextSteps(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    {nextStatus === FUNNEL_STAGES.EN_CALIFICACION && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enviar a SGRs</label>
                            <div className="mt-2 space-y-2">
                                {sgrs.map(sgr => (
                                    <label key={sgr.id} className="flex items-center">
                                        <input type="checkbox" onChange={() => handleSgrSelection(sgr.name)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                        <span className="ml-2 text-gray-700">{sgr.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Guardar</button>
                </div>
            </div>
        </div>
    );
};

// --- MODAL PARA GESTIONAR CALIFICACIONES DE SGRs ---
const QualificationManagementModal = ({ client, onClose, onSave }) => {
    const [qualifications, setQualifications] = useState(JSON.parse(JSON.stringify(client.qualifications)));

    const handleUpdate = (qualId, field, value) => {
        const updated = qualifications.map(q => q.qualificationId === qualId ? { ...q, [field]: value } : q);
        setQualifications(updated);
    };

    const handleSave = (qual) => {
        onSave(client.id, qual);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Gestionar Calificaciones: {client.name}</h2>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {qualifications.map(qual => (
                        <div key={qual.qualificationId} className="border p-3 rounded-lg">
                            <p className="font-semibold">{qual.sgrName}</p>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="text-xs">Estado</label>
                                    <select value={qual.status} onChange={(e) => handleUpdate(qual.qualificationId, 'status', e.target.value)} className="w-full p-1 border rounded">
                                        <option value="en_espera">En Espera</option>
                                        <option value="aprobado">Aprobado</option>
                                        <option value="rechazado">Rechazado</option>
                                    </select>
                                </div>
                                {qual.status === 'aprobado' && (
                                    <>
                                        <div><label className="text-xs">Monto Aprobado</label><input type="number" value={qual.amount || ''} onChange={(e) => handleUpdate(qual.qualificationId, 'amount', parseFloat(e.target.value))} className="w-full p-1 border rounded" /></div>
                                        <div><label className="text-xs">Vencimiento</label><input type="date" value={qual.dueDate || ''} onChange={(e) => handleUpdate(qual.qualificationId, 'dueDate', e.target.value)} className="w-full p-1 border rounded" /></div>
                                        <div><label className="text-xs">Destino</label><input type="text" value={qual.destination || ''} onChange={(e) => handleUpdate(qual.qualificationId, 'destination', e.target.value)} className="w-full p-1 border rounded" /></div>
                                    </>
                                )}
                                {qual.status === 'rechazado' && (
                                    <div><label className="text-xs">Motivo</label><input type="text" value={qual.reason || ''} onChange={(e) => handleUpdate(qual.qualificationId, 'reason', e.target.value)} className="w-full p-1 border rounded" /></div>
                                )}
                            </div>
                            <button onClick={() => handleSave(qualifications.find(q => q.qualificationId === qual.qualificationId))} className="mt-2 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Guardar Gestión</button>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cerrar</button>
                </div>
            </div>
        </div>
    );
};


export default function FunnelView({ clients, sgrs, onUpdateManagementStatus, onUpdateSgrQualification }) {
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalType, setModalType] = useState(null); // 'detail', 'status', o 'qualification'

    const handleCardClick = (client) => {
        setSelectedClient(client);
        setModalType('detail');
    };
    
    const handleAdvanceClick = () => {
        if (!selectedClient) return;
        if (selectedClient.management.status === FUNNEL_STAGES.EN_CALIFICACION) {
            setModalType('qualification');
        } else {
            setModalType('status');
        }
    };

    const closeModal = () => {
        setSelectedClient(null);
        setModalType(null);
    };

    const funnelData = useMemo(() => {
        const stages = Object.values(FUNNEL_STAGES);
        const grouped = stages.reduce((acc, stage) => ({ ...acc, [stage]: [] }), {});
        clients.forEach(client => {
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
                                        {stage.clients.map((client, index) => (
                                            <Draggable key={client.management.id} draggableId={client.management.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition"
                                                        onClick={() => handleCardClick(client)}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-gray-800">{client.name}</h3>
                                                                <p className="text-sm text-gray-600 mt-1 italic">
                                                                    {client.relevamiento || 'Sin motivo de contacto'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>

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
                    />
                )}
                {selectedClient && modalType === 'qualification' && (
                    <QualificationManagementModal
                        client={selectedClient}
                        onClose={closeModal}
                        onSave={onUpdateSgrQualification}
                    />
                )}
            </div>
        </DragDropContext>
    );
}