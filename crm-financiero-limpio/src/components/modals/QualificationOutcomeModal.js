import React, { useState } from 'react';
import { X } from 'lucide-react';
import InputField from '../common/InputField';
import { FUNNEL_STAGES } from '../../data';

export default function QualificationOutcomeModal({ client, onClose, onSave }) {
    const activeQualifications = client.qualifications.filter(q => q.status === FUNNEL_STAGES.in_qualification);
    const [qualifications, setQualifications] = useState(activeQualifications);
    
    // Obtener los nombres de SGRs únicos para mostrar
    const uniqueSgrNames = [...new Set(qualifications.map(q => q.sgrName))];

    const handleStatusChange = (sgrName, newStatus) => {
        setQualifications(prev =>
            prev.map(q => 
                q.sgrName === sgrName 
                    ? { ...q, status: newStatus } 
                    : q
            )
        );
    };

    const handleQualificationDataChange = (sgrName, name, value) => {
        setQualifications(prev =>
            prev.map(q => 
                q.sgrName === sgrName
                    ? { 
                        ...q,
                        lineAmount: name === 'lineAmount' ? parseFloat(value) || 0 : q.lineAmount,
                        destination: name === 'destination' ? value : q.destination,
                        lineExpiryDate: name === 'lineExpiryDate' ? value : q.lineExpiryDate,
                        notes: name === 'notes' ? [{ date: new Date().toISOString(), note: value }] : q.notes
                    } 
                    : q
            )
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Gestión de Calificaciones para {client.name}</h2>
                <div className="space-y-6">
                    {uniqueSgrNames.map((sgrName, index) => {
                        const qualification = qualifications.find(q => q.sgrName === sgrName);
                        return (
                            <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-inner">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-lg">{sgrName}</h3>
                                    <select 
                                        value={qualification?.status || FUNNEL_STAGES.in_qualification} 
                                        onChange={(e) => handleStatusChange(sgrName, e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm text-sm"
                                    >
                                        <option value={FUNNEL_STAGES.in_qualification}>En Calificación</option>
                                        <option value={FUNNEL_STAGES.qualified}>Calificado (Ganado)</option>
                                        <option value={FUNNEL_STAGES.lost}>No Calificado (Perdido)</option>
                                    </select>
                                </div>

                                {(qualification?.status === FUNNEL_STAGES.qualified) && (
                                    <div className="space-y-2 p-2 border-l-4 border-green-500 bg-white">
                                        <h4 className="font-semibold text-sm text-green-700">Datos de la Línea Aprobada</h4>
                                        <InputField
                                            label="Monto Aprobado"
                                            name="lineAmount"
                                            type="number"
                                            value={qualification.lineAmount}
                                            onChange={(e) => handleQualificationDataChange(sgrName, 'lineAmount', e.target.value)}
                                        />
                                        <InputField
                                            label="Destino de los fondos"
                                            name="destination"
                                            value={qualification.destination}
                                            onChange={(e) => handleQualificationDataChange(sgrName, 'destination', e.target.value)}
                                        />
                                        <InputField
                                            label="Vencimiento de la Línea"
                                            name="lineExpiryDate"
                                            type="date"
                                            value={qualification.lineExpiryDate}
                                            onChange={(e) => handleQualificationDataChange(sgrName, 'lineExpiryDate', e.target.value)}
                                        />
                                    </div>
                                )}

                                {(qualification?.status === FUNNEL_STAGES.lost) && (
                                    <div className="space-y-2 p-2 border-l-4 border-red-500 bg-white">
                                        <h4 className="font-semibold text-sm text-red-700">Motivo del rechazo</h4>
                                        <InputField
                                            label="Motivo"
                                            name="notes"
                                            type="textarea"
                                            value={qualification.notes[0]?.note || ''}
                                            onChange={(e) => handleQualificationDataChange(sgrName, 'notes', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400">
                        Cerrar
                    </button>
                    <button 
                        onClick={() => onSave(qualifications)} 
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
}