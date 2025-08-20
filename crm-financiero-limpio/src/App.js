// src/App.js

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users as FunnelIcon, Briefcase, Shield, Megaphone, Upload, Download, Calendar, Tag } from 'lucide-react';
import { initialClients, initialSGRs, initialCampaigns, initialProducts, sgrChecklists, FUNNEL_STAGES } from './data';
import DashboardView from './views/DashboardView';
import FunnelView from './views/FunnelView';
import ClientsView from './views/ClientsView';
import SGRView from './views/SGRView';
import CampaignsView from './views/CampaignsView';
import AgendaView from './views/AgendaView';
import ProductsView from './views/ProductsView';
import ImportOnStartupModal from './components/modals/ImportOnStartupModal';

const Header = ({ onImportClick, onExportClick, lastSaved }) => {
    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-700">CRM Financiero</h1>
            <div className="flex items-center space-x-4">
                {lastSaved && <p className="text-sm text-gray-500">Autoguardado: {lastSaved.toLocaleTimeString()}</p>}
                <button
                    onClick={onImportClick}
                    className="flex items-center bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                >
                    <Upload size={18} className="mr-2" />
                    Cargar Backup
                </button>
                <button
                    onClick={onExportClick}
                    className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    <Download size={18} className="mr-2" />
                    Guardar Backup
                </button>
            </div>
        </header>
    );
};

const APP_DATA_VERSION = '2.2';

export default function App() {
    const [clients, setClients] = useState(() => {
        let finalClients = initialClients;
        try {
            const savedJSON = localStorage.getItem('crm-clients');
            if (savedJSON) {
                const savedObject = JSON.parse(savedJSON);
                if (savedObject.version === APP_DATA_VERSION && Array.isArray(savedObject.data)) {
                    finalClients = savedObject.data;
                }
            }
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        }

        return finalClients.map(client => {
            if (client.management && client.management.id) {
                return client;
            }
            return {
                ...client,
                management: {
                    id: `gest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    status: client.status || FUNNEL_STAGES.PROSPECTO,
                    history: [{
                        status: client.status || FUNNEL_STAGES.PROSPECTO,
                        date: new Date().toISOString(),
                        notes: "Gestión creada o actualizada automáticamente."
                    }],
                },
                qualifications: client.qualifications || [],
                activities: client.activities || [],
                documents: client.documents || [],
            };
        });
    });

    const [sgrs, setSgrs] = useState(() => initialSGRs);
    const [campaigns, setCampaigns] = useState(() => initialCampaigns);
    const [products, setProducts] = useState(() => initialProducts);
    
    const [view, setView] = useState('funnel');
    const [lastSaved, setLastSaved] = useState(null);
    const [showImportOnStartup, setShowImportOnStartup] = useState(false);
    const [triggerNewClient, setTriggerNewClient] = useState(false);
    const [preSelectedClient, setPreSelectedClient] = useState(null);

    useEffect(() => {
        const dataToSave = { version: APP_DATA_VERSION, data: clients };
        localStorage.setItem('crm-clients', JSON.stringify(dataToSave));
        setLastSaved(new Date());
    }, [clients]);

    const handleUpdateManagement = (clientId, updatedData) => {
        setClients(prevClients => 
            prevClients.map(client => {
                if (client.id === clientId) {
                    const updatedClient = { ...client };
                    
                    // 1. Actualizar Relevamiento
                    updatedClient.relevamiento = updatedData.relevamiento;

                    // 2. Actualizar Calificaciones
                    updatedClient.qualifications = updatedData.qualifications;

                    // 3. Manejar cambio de estado
                    const statusChanged = updatedClient.management.status !== updatedData.status;
                    if (statusChanged) {
                        updatedClient.management.status = updatedData.status;
                        updatedClient.management.history.push({
                            status: updatedData.status,
                            date: new Date().toISOString(),
                            nextSteps: updatedData.nextSteps,
                            notes: updatedData.notes,
                        });

                        // Crear nuevas calificaciones si se pasa a "EN CALIFICACIÓN"
                        if (updatedData.status === FUNNEL_STAGES.EN_CALIFICACION && updatedData.sgrsToQualify.length > 0) {
                            const newQualifications = updatedData.sgrsToQualify.map(sgrName => ({
                                qualificationId: `qual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                sgrName: sgrName,
                                status: 'en_espera',
                                submissionDate: new Date().toISOString(),
                            }));
                            updatedClient.qualifications = [...(updatedClient.qualifications || []), ...newQualifications];
                        }
                    }
                    
                    // 4. Verificar si todas las calificaciones están resueltas para mover a Ganado/Perdido
                    const resolvedQualifications = updatedClient.qualifications.filter(q => q.status !== 'en_espera');
                    if (updatedClient.qualifications.length > 0 && resolvedQualifications.length === updatedClient.qualifications.length) {
                        const hasApproval = resolvedQualifications.some(q => q.status === 'aprobado');
                        updatedClient.management.status = hasApproval ? FUNNEL_STAGES.GANADO : FUNNEL_STAGES.PERDIDO;
                    }

                    updatedClient.lastUpdate = new Date().toISOString();
                    return updatedClient;
                }
                return client;
            })
        );
        alert('Gestión actualizada correctamente.');
    };

    const handleAddClient = (newClientData) => {
        const { motivo, montoAproximado, observaciones, ...clientDetails } = newClientData;
        const newClient = {
            ...clientDetails,
            id: `client-${Date.now()}`,
            relevamiento: motivo,
            management: {
                id: `gest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                status: FUNNEL_STAGES.PROSPECTO,
                history: [{ 
                    status: FUNNEL_STAGES.PROSPECTO, 
                    date: new Date().toISOString(), 
                    notes: `Monto Aprox: ${montoAproximado || 'N/A'}. Observaciones: ${observaciones || 'Creación inicial.'}`
                }],
            },
            qualifications: [],
            activities: [],
            documents: [],
        };
        setClients(prevClients => [...prevClients, newClient]);
        alert(`Cliente "${newClient.name}" creado exitosamente.`);
        setView('funnel');
        setTriggerNewClient(false);
    };

    const handleAddNewBusiness = (clientId, businessData) => {
        setClients(prevClients => 
            prevClients.map(client => {
                if (client.id === clientId) {
                    const updatedClient = { ...client };
                    const newManagement = {
                        id: `gest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        status: FUNNEL_STAGES.PROSPECTO,
                        history: [
                            ...(updatedClient.management.history || []),
                            {
                                status: 'NUEVO NEGOCIO INICIADO',
                                date: new Date().toISOString(),
                                notes: `Se inició un nuevo flujo de trabajo. Motivo: ${businessData.motivo}`
                            },
                            {
                                status: FUNNEL_STAGES.PROSPECTO,
                                date: new Date().toISOString(),
                                notes: `Monto Aprox: ${businessData.montoAproximado || 'N/A'}. Observaciones: ${businessData.observaciones || ''}`
                            }
                        ]
                    };
                    updatedClient.management = newManagement;
                    updatedClient.relevamiento = businessData.motivo;
                    updatedClient.lastUpdate = new Date().toISOString();
                    return updatedClient;
                }
                return client;
            })
        );
        alert('Nuevo negocio creado. El cliente ha sido movido a "Prospecto" en el embudo.');
        setView('funnel');
    };

    const handleUpdateClient = (updatedClient) => {
        setClients(prevClients => prevClients.map(c => c.id === updatedClient.id ? updatedClient : c));
    };

    const navigateToClient = (client) => {
        setView('clients');
        setPreSelectedClient(client);
    };

    const handleAddDocument = (clientId, newDocument) => {
        setClients(prevClients => 
            prevClients.map(client => {
                if (client.id === clientId) {
                    const updatedClient = { ...client };
                    if (!updatedClient.documents) {
                        updatedClient.documents = [];
                    }
                    updatedClient.documents.push({
                        id: `doc-${Date.now()}`,
                        ...newDocument,
                        uploadDate: new Date().toISOString()
                    });
                    return updatedClient;
                }
                return client;
            })
        );
    };

    const handleAddSgr = (newSgr) => {
        const sgrWithId = { ...newSgr, id: `sgr-${Date.now()}`, checklist: JSON.parse(JSON.stringify(sgrChecklists)) };
        setSgrs(prevSgrs => [...prevSgrs, sgrWithId]);
    };

    const handleUpdateSgr = (updatedSgr) => {
        setSgrs(prevSgrs => prevSgrs.map(s => s.id === updatedSgr.id ? updatedSgr : s));
    };

    const handleDeleteSgr = (sgrId) => {
        setSgrs(prevSgrs => prevSgrs.filter(s => s.id !== sgrId));
    };

    const handleExport = () => {
        // ... (código de exportación sin cambios)
    };

    const handleImport = (event) => {
        // ... (código de importación sin cambios)
    };

    const triggerImport = () => {
        document.getElementById('import-file-input').click();
    };

    return (
        <div className="bg-gray-100 font-sans min-h-screen flex">
            <aside className="w-20 bg-gray-800 text-white flex flex-col items-center py-4">
                 <div className="space-y-6 flex-grow">
                    <button onClick={() => setView('dashboard')} className={`p-3 rounded-lg ${view === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Panel de Inicio"><LayoutDashboard /></button>
                    <button onClick={() => setView('funnel')} className={`p-3 rounded-lg ${view === 'funnel' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Embudo de Clientes"><FunnelIcon /></button>
                    <button onClick={() => setView('clients')} className={`p-3 rounded-lg ${view === 'clients' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Clientes"><Briefcase /></button>
                    <button onClick={() => setView('agenda')} className={`p-3 rounded-lg ${view === 'agenda' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Agenda"><Calendar /></button>
                    <button onClick={() => setView('products')} className={`p-3 rounded-lg ${view === 'products' ? 'bg-blue-600' : 'hover:bg-ray-700'}`} title="Productos"><Tag /></button>
                    <button onClick={() => setView('sgr')} className={`p-3 rounded-lg ${view === 'sgr' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Entidades de Garantía"><Shield /></button>
                    <button onClick={() => setView('campaigns')} className={`p-3 rounded-lg ${view === 'campaigns' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Campañas"><Megaphone /></button>
                </div>
            </aside>
            <div className="flex-1 flex flex-col">
                <Header onImportClick={triggerImport} onExportClick={handleExport} lastSaved={lastSaved} />
                <main className="flex-1 overflow-y-auto">
                    <input type="file" id="import-file-input" style={{ display: 'none' }} accept=".json" onChange={handleImport} />
                    
                    {view === 'dashboard' && <DashboardView clients={clients} onUpdateClient={handleUpdateClient} setView={setView} onNewClient={() => { setView('clients'); setTriggerNewClient(true); }} onNavigateToClient={navigateToClient} />}
                    
                    {view === 'funnel' && <FunnelView 
                        clients={clients} 
                        sgrs={sgrs}
                        onUpdateManagement={handleUpdateManagement}
                        onNavigateToClient={navigateToClient}
                    />}
                    
                    {view === 'clients' && <ClientsView 
                        onAddClient={handleAddClient}
                        clients={clients}
                        setClients={setClients}
                        sgrs={sgrs}
                        products={products}
                        triggerNewClient={triggerNewClient}
                        setTriggerNewClient={setTriggerNewClient}
                        preSelectedClient={preSelectedClient}
                        clearPreSelectedClient={() => setPreSelectedClient(null)}
                        onAddDocument={handleAddDocument}
                        onAddNewBusiness={handleAddNewBusiness}
                    />}

                    {view === 'agenda' && <AgendaView clients={clients} onUpdateClient={handleUpdateClient} />}
                    {view === 'products' && <ProductsView products={products} setProducts={setProducts} />}
                    
                    {view === 'sgr' && <SGRView 
                        sgrs={sgrs} 
                        clients={clients}
                        onAddSgr={handleAddSgr}
                        onUpdateSgr={handleUpdateSgr}
                        onDeleteSgr={handleDeleteSgr}
                    />}
                    
                    {view === 'campaigns' && <CampaignsView allClients={clients} onUpdateClient={handleUpdateClient} campaigns={campaigns} setCampaigns={setCampaigns} onNavigateToClient={navigateToClient} />}
                </main>
            </div>
            {showImportOnStartup && <ImportOnStartupModal onImport={triggerImport} onStartNew={() => setShowImportOnStartup(false)} />}
        </div>
    );
}