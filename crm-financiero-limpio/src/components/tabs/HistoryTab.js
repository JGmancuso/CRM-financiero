import React from 'react';
import { Clock } from 'lucide-react';

export default function HistoryTab({ client }) {
    const history = client.history || [];

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Historial de Interacciones</h3>
            <div className="space-y-4">
                {history.length > 0 ? history.map((item, index) => (
                    <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mr-4 pt-1">
                            <Clock className="text-gray-400" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{new Date(item.date).toLocaleString('es-AR')}</p>
                            <p className="font-semibold text-gray-800">{item.type}</p>
                            <p className="text-gray-600">{item.reason}</p>
                        </div>
                    </div>
                )) : (
                    <p className="text-gray-500">No hay historial para este cliente.</p>
                )}
            </div>
        </div>
    );
}