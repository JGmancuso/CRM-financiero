import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';

export default function NewTaskModal({ onSave, onClose }) {
    const { state } = useData();
    
    // Estado para los campos del formulario
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Estado para la búsqueda y selección de clientes
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);

    // Filtra la lista de clientes en tiempo real según lo que escribe el usuario
    const filteredClients = useMemo(() => {
        if (!searchTerm) return [];
        return state.clients.filter(client =>
            (client.name || client.nombre).toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5); // Mostramos solo los primeros 5 resultados para no saturar
    }, [searchTerm, state.clients]);

    const handleClientSelect = (client) => {
        setSelectedClient(client);
        // Rellenamos el campo de búsqueda con el nombre del cliente seleccionado
        setSearchTerm(client.name || client.nombre);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let finalTask = {
            title: title,
            dueDate: dueDate,
            isCompleted: false,
        };

        // Lógica para asignar el origen correcto
        if (selectedClient && searchTerm === (selectedClient.name || selectedClient.nombre)) {
            // Si hay un cliente seleccionado y el texto no ha cambiado, es una tarea de cliente
            finalTask.clientName = selectedClient.name || selectedClient.nombre;
            finalTask.clientId = selectedClient.id;
            finalTask.source = 'clientes'; // Para el filtro de la agenda
        } else {
            // Si no, es una gestión activa
            finalTask.clientName = 'Gestión Activa';
            finalTask.source = 'gestiones'; // Para el filtro de la agenda
        }
        
        onSave(finalTask);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Crear Nueva Tarea</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Motivo / Descripción de la Tarea</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Fecha de Vencimiento (Agenda)</label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    
                    {/* --- Nuevo Buscador de Clientes --- */}
                    <div className="relative">
                        <label htmlFor="client-search" className="block text-sm font-medium text-gray-700">Asociar a Cliente (opcional)</label>
                        <input
                            type="text"
                            id="client-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar cliente por nombre o dejar vacío para 'Gestión Activa'"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {/* Lista de resultados que aparece al escribir */}
                        {filteredClients.length > 0 && searchTerm && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                                {filteredClients.map(client => (
                                    <li 
                                        key={client.id}
                                        onClick={() => handleClientSelect(client)}
                                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        {client.name || client.nombre}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                            Crear Tarea
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}