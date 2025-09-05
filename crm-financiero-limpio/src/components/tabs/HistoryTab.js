// src/components/tabs/HistoryTab.js
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { generateUnifiedHistory } from '../../utils/historyUtils'; // Importamos nuestra nueva lógica
import { Clock } from 'lucide-react';

export default function HistoryTab({ client }) {
    const { state } = useData(); // Obtenemos el estado global para acceder a todos los negocios

    // Usamos useMemo para calcular la historia unificada solo cuando los datos cambian
    const unifiedHistory = useMemo(
        () => generateUnifiedHistory(client, state.negocios),
        [client, state.negocios]
    );

    return (
        <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Línea de Tiempo del Cliente</h3>
            
            {unifiedHistory.length > 0 ? (
                <div className="space-y-4">
                    {unifiedHistory.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            {/* Icono del evento */}
                            <div className="flex-shrink-0 mt-1">
                                {item.icon}
                            </div>
                            
                            {/* Detalles del evento */}
                            <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-gray-700">{item.type}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(item.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                <p className="text-xs text-gray-400 mt-1">Origen: {item.source}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No hay historial de eventos para este cliente.</p>
            )}
        </div>
    );
}