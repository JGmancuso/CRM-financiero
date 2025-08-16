// src/components/modals/QualificationStatusModal.js

import React, { useState } from 'react';
import InputField from '../common/InputField';

export default function QualificationStatusModal({ client, qualification, newStatus, onClose, onSave }) {
    const [notes, setNotes] = useState('');
    const [qualificationData, setQualificationData] = useState({
        lineAmount: qualification?.lineAmount || 0,
        destination: qualification?.destination || '',
        lineExpiryDate: qualification?.lineExpiryDate || ''
    });

    const isWon = newStatus === 'Calificado (Ganado)';

    const handleDataChange = (e) => {
        const { name, value, type } = e.target;
        setQualificationData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseFloat(value) || 0 : value 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const saveData = { notes };
        if (isWon) {
            saveData.qualificationDetails = qualificationData;
        }
        onSave(saveData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-2">Cambiar Estado de Calificación</h2>
                <p className="text-sm text-gray-600 mb-6">Moviendo a <span className="font-semibold">{client.name} ({qualification.sgrName})</span> al estado: <span className="font-semibold">{newStatus}</span></p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Notas sobre el cambio"
                        name="notes"
                        type="textarea"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: La SGR aprobó la calificación pero solicitó documentación adicional..."
                    />

                    {isWon && (
                        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg space-y-4 animate-fade-in">
                            <h3 className="font-semibold text-blue-800">Datos de la Línea Aprobada</h3>
                            <InputField label="Monto Calificado" name="lineAmount" type="number" value={qualificationData.lineAmount} onChange={handleDataChange} required />
                            <InputField label="Destino de los Fondos" name="destination" value={qualificationData.destination} onChange={handleDataChange} required />
                            <InputField label="Fecha de Vencimiento" name="lineExpiryDate" type="date" value={qualificationData.lineExpiryDate} onChange={handleDataChange} required />
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Confirmar Cambio</button>
                    </div>
                </form>
            </div>
        </div>
    );
}