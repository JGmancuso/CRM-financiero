// src/components/modals/QualificationOutcomeModal.js

import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import InputField from '../common/InputField';

export default function QualificationOutcomeModal({ client, sgrs, onClose, onSave }) {
    // --- LÍNEA CORREGIDA: Añadido || [] para evitar el error si client.qualifications no existe ---
    const activeQualifications = (client.qualifications || []).filter(q => q.status === 'en_espera');
    
    const [qualifications, setQualifications] = useState(
        JSON.parse(JSON.stringify(client.qualifications || []))
    );
    
    const handleUpdate = (qualId, field, value) => {
        setQualifications(prev =>
            prev.map(q => 
                q.qualificationId === qualId 
                    ? { ...q, [field]: value } 
                    : q
            )
        );
    };

    const handleAddNewQualification = (sgrName) => {
        const newQual = {
            qualificationId: `qual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            sgrName: sgrName,
            status: 'en_espera',
            submissionDate: new Date().toISOString(),
        };
        setQualifications(prev => [...prev, newQual]);
    };

    const handleSubmit = () => {
        onSave(qualifications); // Enviamos el array completo de calificaciones
        onClose();
    };

    const assignedSgrNames = qualifications.map(q => q.sgrName);
    const unassignedSgrs = sgrs.filter(s => !assignedSgrNames.includes(s.name));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Gestionar Calificaciones: {client.name}</h2>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    {qualifications.map((qualification) => (
                        <div key={qualification.qualificationId} className="p-4 bg-gray-50 rounded-lg shadow-inner">
                            <h3 className="font-semibold text-lg mb-3">{qualification.sgrName}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Dictamen"
                                    name="status"
                                    as="select"
                                    value={qualification.status || 'en_espera'}
                                    onChange={(e) => handleUpdate(qualification.qualificationId, 'status', e.target.value)}
                                >
                                    <option value="en_espera">En Espera</option>
                                    <option value="aprobado">Aprobado</option>
                                    <option value="rechazado">Rechazado</option>
                                </InputField>

                                {qualification.status === 'aprobado' && (
                                    <>
                                        <InputField label="Monto Aprobado" name="amount" type="number" value={qualification.amount || ''} onChange={(e) => handleUpdate(qualification.qualificationId, 'amount', e.target.value)} />
                                        <InputField label="Vencimiento de Línea" name="dueDate" type="date" value={qualification.dueDate || ''} onChange={(e) => handleUpdate(qualification.qualificationId, 'dueDate', e.target.value)} />
                                        <InputField label="Destino" name="destination" value={qualification.destination || ''} onChange={(e) => handleUpdate(qualification.qualificationId, 'destination', e.target.value)} />
                                    </>
                                )}

                                {qualification.status === 'rechazado' && (
                                    <div className="md:col-span-2">
                                        <InputField label="Motivo del rechazo" name="reason" type="textarea" value={qualification.reason || ''} onChange={(e) => handleUpdate(qualification.qualificationId, 'reason', e.target.value)} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {unassignedSgrs.length > 0 && (
                        <div className="p-4 border-t">
                            <h4 className="font-semibold text-gray-700 mb-3">Añadir más entidades a calificar</h4>
                            <div className="space-y-2">
                                {unassignedSgrs.map(sgr => (
                                    <button key={sgr.id} onClick={() => handleAddNewQualification(sgr.name)} className="w-full text-left p-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center">
                                        <PlusCircle size={16} className="mr-2" />
                                        {sgr.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                        Cerrar
                    </button>
                    <button onClick={handleSubmit} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}