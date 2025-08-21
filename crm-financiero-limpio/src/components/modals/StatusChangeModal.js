// src/components/modals/StatusChangeModal.js

import React, { useState } from 'react';
import { FUNNEL_STAGES } from '../../data';

export default function StatusChangeModal({ client, onClose, onSave, defaultStatus }) {
    // CAMBIO 1: Usar 'status' en lugar de 'management_status' para el estado inicial
    const [status, setStatus] = useState(defaultStatus || client.status);

    const handleSave = () => {
        // CAMBIO 2: Llamar a onSave solo con los dos parámetros que espera: el ID y el nuevo estado.
        onSave(client.id, status);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Cambiar Etapa del Negocio</h2>
                
                <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva Etapa
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Object.values(FUNNEL_STAGES).map(stage => (
                            <option key={stage} value={stage}>{stage}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}