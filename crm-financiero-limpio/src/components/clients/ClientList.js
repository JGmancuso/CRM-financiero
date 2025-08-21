import React from 'react';
import { Building, User } from 'lucide-react';

export default function ClientList({ clients, onSelectClient, selectedClient }) {
    return (
        <nav>
            <ul>
                {(clients || []).map(client => (
                    <li key={client.id}>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onSelectClient(client); }}
                            className={`flex items-center p-4 text-left w-full hover:bg-gray-100 transition duration-200 ${selectedClient?.id === client.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                        >
                            <div className="flex-shrink-0 mr-4">
                                {client.type === 'juridica' ? <Building className="text-gray-500" /> : <User className="text-gray-500" />}
                            </div>
                            <div className="flex-grow">
                                <p className={`font-semibold ${selectedClient?.id === client.id ? 'text-blue-700' : 'text-gray-800'}`}>
                                    {client.nombre || client.name || 'Cliente sin nombre'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    CUIT/CUIL: {client.cuit || client.cuil || 'No disponible'}
                                </p>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}