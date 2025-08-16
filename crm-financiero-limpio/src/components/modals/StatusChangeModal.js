import React, { useState } from 'react';

export default function StatusChangeModal({ onSave, onClose, clientName, newStatus }) {
    const [notes, setNotes] = useState('');
    const [nextStep, setNextStep] = useState('');

    const handleSave = () => {
        onSave(notes, nextStep);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                <h2 className="text-xl font-bold mb-4">Cambiar estado de {clientName}</h2>
                <p className="text-gray-600 mb-4">Movimiento a: <span className="font-semibold">{newStatus}</span></p>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Próximo paso:</label>
                    <input
                        type="text"
                        value={nextStep}
                        onChange={(e) => setNextStep(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Llamar en 3 días para seguimiento"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Observaciones:</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Detalles sobre el cambio de estado, etc."
                    />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button type="button" onClick={handleSave} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Confirmar</button>
                </div>
            </div>
        </div>
    );
}