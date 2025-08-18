// src/views/ClientsView.js

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Search, PlusCircle, Briefcase } from 'lucide-react';
import ClientList from '../components/clients/ClientList';
import ClientDetail from '../components/clients/ClientDetail';
import ClientForm from '../components/clients/ClientForm';

// --- CAMBIO 1: Añadir onAddNewBusiness a la lista de props ---
export default function ClientsView({ onAddClient, clients, setClients, sgrs, products, triggerNewClient, setTriggerNewClient, preSelectedClient, clearPreSelectedClient, documentRequirements, onAddDocument, handleStartQualification, handleUpdateQualificationStatus, onAddNewBusiness }) {
    const [selectedClient, setSelectedClient] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [leftPanelWidth, setLeftPanelWidth] = useState(() => {
        const savedWidth = localStorage.getItem('client-panel-width');
        return savedWidth ? parseFloat(savedWidth) : 33.33;
    });
    const isResizing = useRef(false);
    const containerRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('client-panel-width', leftPanelWidth);
    }, [leftPanelWidth]);

    const handleMouseDown = (e) => {
        isResizing.current = true;
        e.preventDefault();
    };

    const handleMouseUp = useCallback(() => {
        isResizing.current = false;
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isResizing.current || !containerRef.current) {
            return;
        }
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        
        if (newWidth > 20 && newWidth < 80) {
            setLeftPanelWidth(newWidth);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);
    
    useEffect(() => {
        if (preSelectedClient) {
            setSelectedClient(preSelectedClient);
            setViewMode('detail');
            clearPreSelectedClient();
        } else if (!selectedClient && clients && clients.length > 0 && viewMode !== 'form') {
            setSelectedClient(clients[0]);
            setViewMode('detail');
        }
        else if (selectedClient && !clients.find(c => c.id === selectedClient.id)) {
            setSelectedClient(null);
            setViewMode('list');
        }
    }, [preSelectedClient, clients, selectedClient, viewMode, clearPreSelectedClient]);

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

    const handleSaveClient = (client) => {
        if (client.id) {
            const updatedClients = clients.map(c => c.id === client.id ? client : c);
            setClients(updatedClients);
            setSelectedClient(client);
        } else {
            onAddClient(client);
        }
        setViewMode('detail');
        setEditingClient(null);
    };
    
    const handleDeleteClient = (clientId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.')) {
            const updatedClients = clients.filter(c => c.id !== clientId);
            setClients(updatedClients);
            if (selectedClient && selectedClient.id === clientId) {
                setSelectedClient(updatedClients.length > 0 ? updatedClients[0] : null);
                setViewMode(updatedClients.length > 0 ? 'detail' : 'list');
            }
        }
    };
    
    const handleSaveActivity = (activity) => {
        const activities = [...(selectedClient.activities || [])];
        if (activity.id) {
            const index = activities.findIndex(a => a.id === activity.id);
            activities[index] = activity;
        } else {
            activities.push({ ...activity, id: `a${Date.now()}`, completed: false });
        }
        const updatedClient = { ...selectedClient, activities, lastUpdate: new Date().toISOString() };
        setSelectedClient(updatedClient);
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    };

    const handleToggleActivity = (activityId) => {
        const activities = (selectedClient.activities || []).map(a => 
            a.id === activityId ? { ...a, completed: !a.completed } : a
        );
        const updatedClient = { ...selectedClient, activities, lastUpdate: new Date().toISOString() };
        setSelectedClient(updatedClient);
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    };

    const handleSaveFinancing = (instrument) => {
        const instrumentId = `f${Date.now()}`;
        let newActivities = [];
        instrument.schedule.forEach((payment, index) => {
            const paymentDate = new Date(payment.date + 'T00:00:00');
            
            newActivities.push({
                id: `a${Date.now()}-${index}-event`,
                type: 'event',
                title: `Vencimiento: ${instrument.instrument} (${instrument.details})`,
                date: paymentDate.toISOString(),
                note: `Monto: $${payment.amount.toLocaleString('es-AR')}. Tipo: ${payment.type}. (Ref. Instrumento: ${instrumentId})`,
                completed: false
            });

            const reminderDate = new Date(paymentDate);
            reminderDate.setDate(reminderDate.getDate() - 14);
            newActivities.push({
                id: `a${Date.now()}-${index}-reminder`,
                type: 'task',
                title: `RECORDATORIO Vto: ${instrument.instrument}`,
                date: reminderDate.toISOString(),
                note: `El instrumento "${instrument.details}" vence el ${paymentDate.toLocaleDateString('es-AR', {timeZone: 'UTC'})} por un monto de $${payment.amount.toLocaleString('es-AR')}. (Ref. Instrumento: ${instrumentId})`,
                completed: false
            });
        });

        const updatedFinancing = [...(selectedClient.financing || []), { ...instrument, id: instrumentId }];
        const updatedClient = { 
            ...selectedClient, 
            financing: updatedFinancing,
            activities: [...(selectedClient.activities || []), ...newActivities],
            lastUpdate: new Date().toISOString()
        };
        
        setSelectedClient(updatedClient);
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    };
    
    const handleSaveQualification = (qualification) => {
        const qualifications = [...(selectedClient.qualifications || [])];
        let newActivities = [...(selectedClient.activities || [])];
        
        if (qualification.id) {
            const index = qualifications.findIndex(q => q.id === qualification.id);
            qualifications[index] = qualification;
        } else {
            const newQualification = { ...qualification, id: `q-${Date.now()}` };
            qualifications.push(newQualification);
            
            const expiryDate = new Date(newQualification.lineExpiryDate + 'T00:00:00');
            const reminderDate = new Date(expiryDate);
            reminderDate.setDate(reminderDate.getDate() - 20);
            
            newActivities.push({
                id: `a${Date.now()}-qualreminder`,
                type: 'task',
                title: `RECORDATORIO Vto. Línea: ${newQualification.name}`,
                date: reminderDate.toISOString(),
                note: `La línea de calificación por $${newQualification.lineAmount.toLocaleString('es-AR')} vence el ${expiryDate.toLocaleDateString('es-AR', {timeZone: 'UTC'})}.`,
                completed: false
            });
        }
        const updatedClient = { ...selectedClient, qualifications, activities: newActivities, lastUpdate: new Date().toISOString() };
        setSelectedClient(updatedClient);
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    };
    
    const handleUpdateDebtorStatus = (clientId, debtorData) => {
        const clientToUpdate = clients.find(c => c.id === clientId);
        if (clientToUpdate) {
            const updatedClient = { ...clientToUpdate, debtorStatus: debtorData, lastUpdate: new Date().toISOString() };
            setSelectedClient(updatedClient);
            setClients(clients.map(c => c.id === clientId ? updatedClient : c));
        }
    };

    const filteredClients = useMemo(() =>
        (clients || []).filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (client.cuit && client.cuit.includes(searchTerm)) ||
            (client.cuil && client.cuil.includes(searchTerm))
        ),
        [clients, searchTerm]
    );

    if (!clients || clients.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                    <Briefcase size={64} className="mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold">No hay clientes</h2>
                    <p className="mb-4">Tu lista de clientes está vacía.</p>
                    <button onClick={() => handleShowForm()} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center mx-auto">
                        <PlusCircle size={18} className="mr-2"/> Crear Primer Cliente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full" ref={containerRef}>
            <div className="border-r border-gray-200 bg-white flex flex-col" style={{ width: `${leftPanelWidth}%` }}>
                <div className="p-4 border-b flex items-center space-x-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button onClick={() => handleShowForm()} className="flex-shrink-0 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300" title="Nuevo Cliente">
                        <PlusCircle />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <ClientList clients={filteredClients} onSelectClient={handleSelectClient} selectedClient={selectedClient} />
                </div>
            </div>
            
            <div className="w-2 cursor-col-resize bg-gray-300 hover:bg-blue-500 transition-colors rounded-full" onMouseDown={handleMouseDown}></div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                {viewMode === 'detail' && selectedClient && 
                    <ClientDetail 
                        client={selectedClient} 
                        onEdit={handleShowForm} 
                        onDelete={handleDeleteClient} 
                        onSaveActivity={handleSaveActivity} 
                        onToggleActivity={handleToggleActivity} 
                        onSaveFinancing={handleSaveFinancing} 
                        onSaveQualification={handleSaveQualification} 
                        onUpdateDebtorStatus={(data) => handleUpdateDebtorStatus(selectedClient.id, data)}
                        documentRequirements={documentRequirements}
                        onAddDocument={onAddDocument}
                        handleStartQualification={handleStartQualification}
                        onUpdateQualificationStatus={handleUpdateQualificationStatus}
                        onAddNewBusiness={onAddNewBusiness} // <-- CAMBIO 2: Pasar la prop a ClientDetail
                    />}

                {viewMode === 'form' && <ClientForm onSave={handleSaveClient} onCancel={() => setViewMode(selectedClient ? 'detail' : 'list')} clientToEdit={editingClient} />}
                
                {(viewMode === 'list' || !selectedClient) && clients.length > 0 && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
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

