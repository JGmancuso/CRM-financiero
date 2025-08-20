// src/components/modals/StatusChangeModal.js

import React, { useState } from 'react';
import { FUNNEL_STAGES } from '../../data';

export default function StatusChangeModal({ client, sgrs, onClose, onSave, defaultStatus = '' }) {
    const [nextStatus, setNextStatus] = useState(defaultStatus || '');
    const [nextSteps, setNextSteps] = useState('');
    const [notes, setNotes] = useState('');
    const [sgrsToQualify, setSgrsToQualify] = useState([]);

    const handleSave = () => {
        if (!nextStatus || !nextSteps) {
            alert("Por favor, complete el próximo estado y los próximos pasos.");
            return;
        }
        if (nextStatus === FUNNEL_STAGES.EN_CALIFICACION && sgrsToQualify.length === 0) {
            alert("Por favor, seleccione al menos una Entidad para enviar a calificación.");
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
                <h2 className="text-2xl font-bold mb-4">Avanzar Gestión: {client.name}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Próximo Estado</label>
                        <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Seleccione un estado...</option>
                            {availableStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Próximos Pasos (requerido)</label>
                        <input type="text" value={nextSteps} onChange={(e) => setNextSteps(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    {nextStatus === FUNNEL_STAGES.EN_CALIFICACION && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enviar a Entidades para Calificación</label>
                            <div className="mt-2 space-y-2">
                                {(sgrs || []).map(sgr => (
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
                    <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Confirmar Avance</button>
                </div>
            </div>
        </div>
    );
};