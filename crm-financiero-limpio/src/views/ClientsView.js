import React, { useState, useMemo, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import ClientList from '../components/clients/ClientList';
import ClientDetail from '../components/clients/ClientDetail';
import ClientForm from '../components/clients/ClientForm';
import CuitQuickCheck from '../components/clients/CuitQuickCheck';
import ClientsHeader from '../components/clients/ClientsHeader';

export default function ClientsView({
    clients, negocios, onSaveClient, onAddClient, ...otherProps 
}) {
    const [selectedClient, setSelectedClient] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [initialCuit, setInitialCuit] = useState('');

    useEffect(() => {
        if (!selectedClient && clients && clients.length > 0) {
            setSelectedClient(clients[0]);
            setViewMode('detail');
        } else if (!selectedClient && (!clients || clients.length === 0)) {
            setViewMode('list');
        }
    }, [clients]);

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setViewMode('detail');
    };

    const handleProceedFromCheck = (cuit) => {
        setInitialCuit(cuit);
        setViewMode('form');
    };

    const handleSaveClient = (clientData) => {
        let savedClient;
        if (clientData.id) {
            onSaveClient(clientData);
            savedClient = clientData;
        } else {
            savedClient = onAddClient(clientData);
        }
        setSelectedClient(savedClient);
        setViewMode('detail');
    };
    
    const handleCancel = () => {
        setViewMode(selectedClient ? 'detail' : 'list');
    };

    const filteredClients = useMemo(() =>
        (clients || []).filter(client => 
            (client.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (client.cuit || '').includes(searchTerm)
        ), [clients, searchTerm]
    );
    
    const renderContentPanel = () => {
        switch (viewMode) {
            case 'quickCheck':
                return <CuitQuickCheck onProceed={handleProceedFromCheck} onCancel={handleCancel} />;
            case 'form':
                const clientToEdit = clients.find(c => c.id === selectedClient?.id) || null;
                return <ClientForm onSave={handleSaveClient} onCancel={handleCancel} clientToEdit={clientToEdit} initialCuit={initialCuit} />;
            case 'detail':
                if (selectedClient) {
                    return <ClientDetail 
                                client={selectedClient} 
                                {...{ clients, negocios, ...otherProps }}
                                onEdit={() => setViewMode('form')}
                           />;
                }
            default:
                return (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <Briefcase size={64} className="mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold">Selecciona o crea un cliente</h2>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-full bg-gray-50">
            <div className="w-1/3 border-r bg-white flex flex-col">
                <ClientsHeader 
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    onNewClientClick={() => { setSelectedClient(null); setViewMode('quickCheck'); }}
                />
                <div className="flex-grow overflow-y-auto">
                    <ClientList clients={filteredClients} onSelectClient={handleSelectClient} selectedClient={selectedClient} />
                </div>
            </div>
            <div className="w-2/3 p-8 overflow-y-auto">
                {renderContentPanel()}
            </div>
        </div>
    );
}