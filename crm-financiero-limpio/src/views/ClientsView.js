import React, { useState, useMemo, useEffect } from 'react';
import { Search, PlusCircle, Briefcase } from 'lucide-react';
import ClientList from '../components/clients/ClientList';
import ClientDetail from '../components/clients/ClientDetail';
import ClientForm from '../components/clients/ClientForm';

export default function ClientsView({
    clients,
    negocios,
    sgrs,
    onUpdateNegocio,
    onSaveClient,
    onDeleteClient,
    onAddClientAndBusiness,
    onAddNewBusiness,
    onAddDocument,
    // Asumiendo que estas props vienen de App.js también
    onSaveActivity,
    onToggleActivity,
    onSaveFinancing,
    onSaveQualification,
    onUpdateDebtorStatus,
    documentRequirements
}) {
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedNegocio, setSelectedNegocio] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!selectedClient && clients && clients.length > 0) {
            setSelectedClient(clients[0]);
        }
    }, [clients, selectedClient]);

    useEffect(() => {
        if (selectedClient && negocios) {
            // Encuentra el primer negocio activo, o el más reciente si hay varios
            const negociosDelCliente = negocios.filter(n => n.cliente.id === selectedClient.id);
            setSelectedNegocio(negociosDelCliente[0] || null);
        } else {
            setSelectedNegocio(null);
        }
    }, [selectedClient, negocios]);

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setViewMode('detail');
        setEditingClient(null);
    };

    const handleShowForm = (clientToEdit = null) => {
        setEditingClient(clientToEdit);
        setSelectedClient(clientToEdit);
        setViewMode('form');
    };

    const handleSave = (clientData) => {
        if (clientData.id) {
            onSaveClient(clientData);
            setSelectedClient(clientData);
        } else {
            onAddClientAndBusiness(clientData);
        }
        setViewMode('detail');
        setEditingClient(null);
    };
    
    const handleCancelForm = () => {
        setViewMode(selectedClient ? 'detail' : 'list');
        setEditingClient(null);
    };

    const filteredClients = useMemo(() =>
        (clients || []).filter(client => {
            const nameMatch = (client.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());
            const cuitMatch = (client.cuit && client.cuit.includes(searchTerm));
            return nameMatch || cuitMatch;
        }),
        [clients, searchTerm]
    );

    return (
        <div className="flex h-full bg-gray-50">
            <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
                <div className="p-4 border-b flex items-center space-x-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <button onClick={() => handleShowForm()} className="flex-shrink-0 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700" title="Nuevo Cliente">
                        <PlusCircle />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <ClientList clients={filteredClients} onSelectClient={handleSelectClient} selectedClient={selectedClient} />
                </div>
            </div>
            <div className="w-2/3 p-8 overflow-y-auto">
                {viewMode === 'detail' && selectedClient && 
                    <ClientDetail 
                        client={selectedClient}
                        clients={clients} // <-- Se pasa la lista completa de clientes
                        negocio={selectedNegocio}
                        sgrs={sgrs}
                        onUpdateNegocio={onUpdateNegocio}
                        onEdit={handleShowForm} 
                        onDelete={onDeleteClient}
                        onAddDocument={onAddDocument}
                        onAddNewBusiness={onAddNewBusiness}
                        onSaveActivity={(activityData) => onSaveActivity(activityData, selectedClient.id)}
                        onToggleActivity={onToggleActivity}
                        onSaveFinancing={onSaveFinancing}
                        onSaveQualification={onSaveQualification}
                        onUpdateDebtorStatus={onUpdateDebtorStatus}
                        documentRequirements={documentRequirements}
                    />}
                {viewMode === 'form' && <ClientForm onSave={handleSave} onCancel={handleCancelForm} clientToEdit={editingClient} />}
                {viewMode !== 'form' && !selectedClient && (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <div>
                            <Briefcase size={64} className="mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold">Selecciona un cliente</h2>
                            <p>Haz clic en un cliente de la lista para ver sus detalles.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}