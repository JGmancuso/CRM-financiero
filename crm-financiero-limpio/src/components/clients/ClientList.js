import React from 'react';
import { Building, User } from 'lucide-react';

export default function ClientList({ clients, onSelectClient, selectedClient }) {
    return (
        <nav>
            <ul>
                {/* Usamos (clients || []) para evitar errores si la lista está vacía */}
                {(clients || []).map(client => (
                    <li key={client.id}>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onSelectClient(client); }}
                            className={`flex items-center p-4 text-left w-full hover:bg-gray-100 transition duration-200 ${selectedClient && selectedClient.id === client.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                        >
                            <div className="flex-shrink-0 mr-4">
                                {/* Mantenemos la lógica del ícono, asumiendo que 'type' existe */}
                                {client.type === 'juridica' ? <Building className="text-gray-500" /> : <User className="text-gray-500" />}
                            </div>
                            <div className="flex-grow">
                                {/* CAMBIO 1: Usamos 'client.nombre' en lugar de 'client.name' */}
                                <p className={`font-semibold ${selectedClient && selectedClient.id === client.id ? 'text-blue-700' : 'text-gray-800'}`}>
                                    {client.nombre || 'Cliente sin nombre'}
                                </p>
                                
                                {/* CAMBIO 2: Mostramos el CUIT, que es el dato que tenemos */}
                                <p className="text-sm text-gray-500">
                                    CUIT: {client.cuit || 'No disponible'}
                                </p>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}