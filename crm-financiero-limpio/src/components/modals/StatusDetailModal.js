import React from 'react';

export default function StatusDetailModal({ client, onClose }) {
    // Encontrar el último cambio de estado para mostrar sus notas
    const lastStatusChange = client.history && client.history.length > 0
        ? client.history.slice().reverse().find(entry => 
            (entry.type === 'Status Change' || entry.type === 'Funnel Change') && entry.note // <-- Añadido el "&& entry.note"
        )
        : null;

    // Encontrar la última actividad que sea un "próximo paso"
    const lastNextStepActivity = (client.activities || []).slice().reverse().find(activity =>
        activity.type === 'task' && (activity.title.startsWith('Próximos pasos') || activity.title.startsWith('Seguimiento de calificación'))
    );
    
    // Obtener las SGRs de la última acción de calificación
    const lastQualificationEntry = (client.history || []).slice().reverse().find(entry => 
        entry.type === 'Funnel Change' && entry.note && entry.note.startsWith('Enviado a calificar a:') // <-- Añadido el "&& entry.note"
    );
    const lastSgrs = lastQualificationEntry ? lastQualificationEntry.note.substring('Enviado a calificar a:'.length).trim().split(', ') : [];
    const uniqueSgrs = [...new Set(lastSgrs)];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Detalle de estado para {client.name}</h2>
                <div className="space-y-4">
                    {lastStatusChange && (
                        <div>
                            <p className="font-semibold text-sm text-gray-800">Notas del último cambio:</p>
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <p className="text-sm text-gray-600 italic">"{lastStatusChange.note || 'Sin notas.'}"</p>
                                <p className="text-xs text-gray-400 mt-2">Movido el: {new Date(lastStatusChange.date).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                    
                    {lastNextStepActivity && (
                        <div>
                            <p className="font-semibold text-sm text-gray-800 mt-4">Próximo paso:</p>
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <p className="font-medium text-sm">{lastNextStepActivity.title}</p>
                                <p className="text-sm text-gray-600 italic">"{lastNextStepActivity.note}"</p>
                                <p className="text-xs text-gray-500 mt-1">Fecha de seguimiento: {new Date(lastNextStepActivity.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}

                    {client.status === 'En Calificación' && uniqueSgrs.length > 0 && (
                        <div>
                            <p className="font-semibold text-sm text-gray-800 mt-4">Enviado a las siguientes SGRs:</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                {uniqueSgrs.map((sgrName, index) => (
                                    <li key={index} className="text-sm text-gray-600">
                                        <span className="font-semibold">{sgrName}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}