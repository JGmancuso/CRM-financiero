// src/components/modals/ManagementDetailModal.js

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function ManagementDetailModal({ client, onClose, onAdvance }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-xl">
                <h2 className="text-2xl font-bold mb-4">Historial de Gestión: {client.name}</h2>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {(client.management.history || []).map((entry, index) => (
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