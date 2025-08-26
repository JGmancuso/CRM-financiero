import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Briefcase } from 'lucide-react';
import ClientList from '../components/clients/ClientList';
import ClientDetail from '../components/clients/ClientDetail';
import ClientForm from '../components/clients/ClientForm';
import CuitQuickCheck from '../components/clients/CuitQuickCheck';
import ClientsHeader from '../components/clients/ClientsHeader';
import { useData } from '../context/DataContext';

export default function ClientsView({ clients, negocios, ...otherProps }) {
    const { dispatch } = useData();
    const [selectedClient, setSelectedClient] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [initialCuit, setInitialCuit] = useState('');

    // --- Lógica para el panel ajustable ---
    const [panelWidth, setPanelWidth] = useState(33);
    const isResizing = useRef(false);
    const handleMouseDown = (e) => { isResizing.current = true; };
    const handleMouseMove = useCallback((e) => {
        if (!isResizing.current) return;
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 20 && newWidth < 80) setPanelWidth(newWidth);
    }, []);
    const handleMouseUp = () => { isResizing.current = false; };
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove]);
    
    // --- Hook para auto-seleccionar el primer cliente ---
    useEffect(() => {
        if (clients && clients.length > 0 && !selectedClient) {
            setSelectedClient(clients[0]);
            setViewMode('detail');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clients]);

    // --- Funciones de manejo de eventos ---
    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setViewMode('detail');
    };
    
    const handleSaveClient = (clientData) => {
        let savedClient;
        if (clientData.id) {
            dispatch({ type: 'UPDATE_CLIENT', payload: clientData });
            savedClient = clientData;
        } else {
             const newClient = {
                ...clientData, id: `client-${Date.now()}`,
                qualifications: [], activities: [], documents: [], financing: [],
                history: [{ date: new Date().toISOString(), type: 'Creación de Cliente', reason: 'Alta inicial en el sistema.' }]
            };
            dispatch({ type: 'ADD_CLIENT', payload: newClient });
            savedClient = newClient;
        }
        setSelectedClient(savedClient);
        setViewMode('detail');
    };
    
    // 👇 ESTAS SON LAS FUNCIONES QUE FALTABAN
    const handleProceedFromCheck = (cuit) => {
        setInitialCuit(cuit);
        setViewMode('form');
    };

    const handleCancel = () => {
        setViewMode(selectedClient ? 'detail' : 'list');
    };
    // 👆 ---

    const filteredClients = useMemo(() =>
        (clients || []).filter(client => 
            ((client.nombre || client.name) || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (client.cuit || '').includes(searchTerm)
        ), [clients, searchTerm]
    );

    const renderContentPanel = () => {
        switch (viewMode) {
            case 'quickCheck':
                return <CuitQuickCheck onProceed={handleProceedFromCheck} onCancel={handleCancel} />;
            case 'form':
                const clientToEdit = viewMode === 'form' && selectedClient ? selectedClient : null;
                return <ClientForm onSave={handleSaveClient} onCancel={handleCancel} clientToEdit={clientToEdit} initialCuit={initialCuit} />;
            case 'detail':
                if (selectedClient) {
                    return <ClientDetail client={selectedClient} negocios={negocios} {...otherProps} onEdit={() => setViewMode('form')} />;
                }
                return (
                     <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <h2 className="text-2xl font-semibold">Selecciona un cliente de la lista</h2>
                     </div>
                );
            default:
                 return (
                     <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <h2 className="text-2xl font-semibold">Selecciona o crea un cliente</h2>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-full bg-gray-50 overflow-hidden">
            {/* Panel Izquierdo */}
            <div 
                className="border-r bg-white flex flex-col"
                style={{ width: `${panelWidth}%` }}
            >
                <ClientsHeader 
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    onNewClientClick={() => { setSelectedClient(null); setInitialCuit(''); setViewMode('form'); }}
                />
                <div className="flex-grow overflow-y-auto">
                    <ClientList clients={filteredClients} onSelectClient={handleSelectClient} selectedClient={selectedClient} />
                </div>
            </div>

            {/* Manija para arrastrar */}
            <div 
                className="w-2 bg-gray-200 cursor-col-resize hover:bg-blue-300 transition-colors"
                onMouseDown={handleMouseDown}
            />

            {/* Panel Derecho */}
            <div className="flex flex-col flex-grow">
                 <div className="flex-grow p-8 overflow-y-auto">
                    {renderContentPanel()}
                 </div>
            </div>
        </div>
    );
}