import React from 'react';

const getStatusBadgeStyle = (status) => {
    switch (status) {
        case 'GANADO': return 'bg-green-100 text-green-800';
        case 'EN_CALIFICACION': case 'PROPUESTA_FIRMADA': return 'bg-blue-100 text-blue-800';
        case 'PERDIDO': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-600';
    }
};

export default function ClientList({ clients, onSelectClient, selectedClient }) {
    return (
        <ul className="divide-y divide-gray-200">
            {(clients || []).map(client => {
                // 👇 ESTA LÍNEA ES LA CLAVE DE LA CORRECCIÓN
                // Define una variable que usa 'client.nombre' si existe; si no, usa 'client.name'.
                const displayName = client.nombre || client.name;

                return (
                    <li key={client.id}>
                        <button 
                            onClick={() => onSelectClient(client)}
                            className={`w-full text-left p-4 hover:bg-gray-50 focus:outline-none ${selectedClient?.id === client.id ? 'bg-blue-50' : ''}`}
                        >
                            <div className="flex justify-between items-center">
                                {/* Ahora usamos la variable displayName para asegurar que siempre se muestre un nombre */}
                                <p className="font-semibold text-gray-800 truncate">{displayName}</p>
                                {client.status && (
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeStyle(client.status)}`}>
                                        {client.status.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">{client.cuit}</p>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}