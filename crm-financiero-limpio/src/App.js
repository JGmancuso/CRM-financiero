// src/App.js

import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, Users as FunnelIcon, Briefcase, Shield, Megaphone, Upload, Download, Calendar, Tag, RefreshCw } from 'lucide-react';
import { initialClients, initialSGRs, initialCampaigns, initialProducts, sgrChecklists } from './data'; 
import DashboardView from './views/DashboardView';
import FunnelView from './views/FunnelView';
import ClientsView from './views/ClientsView';
import SGRView from './views/SGRView';
import CampaignsView from './views/CampaignsView';
import AgendaView from './views/AgendaView';
import ProductsView from './views/ProductsView';
import ImportOnStartupModal from './components/modals/ImportOnStartupModal';

const Header = ({ onImportClick, onExportClick, onResetData, lastSaved }) => {
    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-700">CRM Financiero</h1>
            <div className="flex items-center space-x-4">
                {lastSaved && <p className="text-sm text-gray-500">Autoguardado: {lastSaved.toLocaleTimeString()}</p>}
                
                <button 
                    onClick={onResetData} 
                    className="flex items-center bg-red-100 text-red-700 font-semibold py-2 px-4 rounded-lg hover:bg-red-200 transition"
                    title="Limpia los datos locales y recarga la aplicación con los datos iniciales"
                >
                    <RefreshCw size={18} className="mr-2" />
                    Resetear Datos
                </button>

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

export default function App() {
    const [clients, setClients] = useState(() => {
        const savedClients = localStorage.getItem('crm-clients');
        return savedClients ? JSON.parse(savedClients) : initialClients;
    });
    const [sgrs, setSgrs] = useState(() => {
        const savedSgrs = localStorage.getItem('crm-sgrs');
        return savedSgrs ? JSON.parse(savedSgrs) : initialSGRs;
    });
    const [campaigns, setCampaigns] = useState(() => {
        const savedCampaigns = localStorage.getItem('crm-campaigns');
        return savedCampaigns ? JSON.parse(savedCampaigns) : initialCampaigns;
    });
    const [products, setProducts] = useState(() => {
        const savedProducts = localStorage.getItem('crm-products');
        return savedProducts ? JSON.parse(savedProducts) : initialProducts;
    });
    const [view, setView] = useState('dashboard');
    const [lastSaved, setLastSaved] = useState(null);
    const [showImportOnStartup, setShowImportOnStartup] = useState(false);
    const [triggerNewClient, setTriggerNewClient] = useState(false);
    const [preSelectedClient, setPreSelectedClient] = useState(null);

    useEffect(() => {
        const savedClients = localStorage.getItem('crm-clients');
        if (!savedClients) {
            setShowImportOnStartup(true);
        }
        setLastSaved(new Date());
    }, []);

    useEffect(() => {
        localStorage.setItem('crm-clients', JSON.stringify(clients));
        setLastSaved(new Date());
    }, [clients]);

    useEffect(() => {
        localStorage.setItem('crm-sgrs', JSON.stringify(sgrs));
        setLastSaved(new Date());
    }, [sgrs]);

    useEffect(() => {
        localStorage.setItem('crm-campaigns', JSON.stringify(campaigns));
        setLastSaved(new Date());
    }, [campaigns]);

    useEffect(() => {
        localStorage.setItem('crm-products', JSON.stringify(products));
        setLastSaved(new Date());
    }, [products]);
    
    useEffect(() => {
        const checkAlerts = () => {
            const now = new Date();
            const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);
            
            clients.forEach(client => {
                (client.activities || []).forEach(activity => {
                    const activityDate = new Date(activity.date);
                    if (!activity.completed && activityDate > now && activityDate <= fiveMinutesFromNow) {
                        if (!sessionStorage.getItem(`alert-${activity.id}`)) {
                            alert(`Recordatorio: "${activity.title}" para ${client.name} en 5 minutos.`);
                            sessionStorage.setItem(`alert-${activity.id}`, 'true');
                        }
                    }
                });
            });
        };

        const intervalId = setInterval(checkAlerts, 60000);
        return () => clearInterval(intervalId);
    }, [clients]);

    const handleResetData = () => {
        if (window.confirm('¿Estás seguro de que quieres borrar todos los datos locales? Se cargará la información de ejemplo por defecto.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const uniqueDocumentRequirements = useMemo(() => {
        const allRequirements = new Set();
        sgrs.forEach(sgr => {
            sgr.checklist?.fisica.forEach(item => allRequirements.add(item));
            sgr.checklist?.juridica.forEach(item => allRequirements.add(item));
        });
        return Array.from(allRequirements).sort();
    }, [sgrs]);

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
                    updatedClient.lastUpdate = new Date().toISOString();
                    return updatedClient;
                }
                return client;
            })
        );
        console.log(`Subiendo archivo para el cliente ${clientId}:`, newDocument.file);
        alert('Documento cargado (simulado).');
    };

    const handleUpdateClient = (updatedClient) => {
        setClients(prevClients => prevClients.map(c => c.id === updatedClient.id ? updatedClient : c));
    };

    const handleAddSgr = (newSgr) => {
        const sgrWithId = { 
            ...newSgr, 
            id: `sgr-${Date.now()}`,
            checklist: JSON.parse(JSON.stringify(sgrChecklists)) 
        };
        setSgrs(prevSgrs => [...prevSgrs, sgrWithId]);
    };

    const handleUpdateSgr = (updatedSgr) => {
        setSgrs(prevSgrs => prevSgrs.map(s => s.id === updatedSgr.id ? updatedSgr : s));
    };

    const handleDeleteSgr = (sgrId) => {
        setSgrs(prevSgrs => prevSgrs.filter(s => s.id !== sgrId));
    };
    
    const handleAddItemToChecklist = (sgrId, personType, newItem) => {
        setSgrs(prevSgrs => prevSgrs.map(sgr => {
            if (sgr.id === sgrId) {
                const updatedSgr = JSON.parse(JSON.stringify(sgr));
                if (updatedSgr.checklist && updatedSgr.checklist[personType]) {
                    updatedSgr.checklist[personType].push(newItem);
                }
                return updatedSgr;
            }
            return sgr;
        }));
    };

    const handleUpdateChecklistItem = (sgrId, personType, itemIndex, newItemText) => {
        setSgrs(prevSgrs => prevSgrs.map(sgr => {
            if (sgr.id === sgrId) {
                const updatedSgr = JSON.parse(JSON.stringify(sgr));
                if (updatedSgr.checklist?.[personType]?.[itemIndex]) {
                    updatedSgr.checklist[personType][itemIndex] = newItemText;
                }
                return updatedSgr;
            }
            return sgr;
        }));
    };
    
    const handleDeleteChecklistItem = (sgrId, personType, itemIndex) => {
        setSgrs(prevSgrs => prevSgrs.map(sgr => {
            if (sgr.id === sgrId) {
                const updatedSgr = JSON.parse(JSON.stringify(sgr));
                if (updatedSgr.checklist?.[personType]?.[itemIndex]) {
                    updatedSgr.checklist[personType].splice(itemIndex, 1);
                }
                return updatedSgr;
            }
            return sgr;
        }));
    };

    const handleExport = () => {
        const dataToExport = { clients, sgrs, campaigns, products, version: '1.0' };
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'crm_backup.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('¡Backup guardado en tu carpeta de Descargas!');
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (importedData.clients && importedData.sgrs && importedData.campaigns) {
                        setClients(importedData.clients);
                        setSgrs(importedData.sgrs);
                        setCampaigns(importedData.campaigns);
                        setProducts(importedData.products || initialProducts);
                        alert('Datos importados correctamente.');
                        setShowImportOnStartup(false);
                    } else {
                        alert('El archivo no tiene el formato correcto.');
                    }
                } catch (error) {
                    alert('Error al leer el archivo. Asegúrate de que sea un backup válido.');
                }
            };
            reader.readAsText(file);
        }
    };

    const triggerImport = () => {
        document.getElementById('import-file-input').click();
    };

    const navigateToClient = (client) => {
        setView('clients');
        setPreSelectedClient(client);
    };
    
    const clearPreSelectedClient = () => {
        setPreSelectedClient(null);
    }

    return (
        <>
            <div className="bg-gray-100 font-sans min-h-screen flex">
                <aside className="w-20 bg-gray-800 text-white flex flex-col items-center py-4">
                    <div className="space-y-6 flex-grow">
                        <button onClick={() => setView('dashboard')} className={`p-3 rounded-lg ${view === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Panel de Inicio"><LayoutDashboard /></button>
                        <button onClick={() => setView('funnel')} className={`p-3 rounded-lg ${view === 'funnel' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Embudo de Clientes"><FunnelIcon /></button>
                        <button onClick={() => setView('clients')} className={`p-3 rounded-lg ${view === 'clients' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Clientes"><Briefcase /></button>
                        <button onClick={() => setView('agenda')} className={`p-3 rounded-lg ${view === 'agenda' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Agenda"><Calendar /></button>
                        <button onClick={() => setView('products')} className={`p-3 rounded-lg ${view === 'products' ? 'bg-blue-600' : 'hover:bg-ray-700'}`} title="Productos"><Tag /></button>
                        <button onClick={() => setView('sgr')} className={`p-3 rounded-lg ${view === 'sgr' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="SGR"><Shield /></button>
                        <button onClick={() => setView('campaigns')} className={`p-3 rounded-lg ${view === 'campaigns' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Campañas"><Megaphone /></button>
                    </div>
                </aside>
                <div className="flex-1 flex flex-col">
                    <Header onImportClick={triggerImport} onExportClick={handleExport} onResetData={handleResetData} lastSaved={lastSaved} />
                    <main className="flex-1 overflow-y-auto">
                        <input type="file" id="import-file-input" style={{ display: 'none' }} accept=".json" onChange={handleImport} />
                        {view === 'dashboard' && <DashboardView clients={clients} onUpdateClient={handleUpdateClient} setView={setView} onNewClient={() => { setView('clients'); setTriggerNewClient(true); }} onNavigateToClient={navigateToClient} />}
                        {view === 'funnel' && <FunnelView clients={clients} onUpdateClient={handleUpdateClient} sgrs={sgrs} onNavigateToClient={navigateToClient} />}
                        
                        {view === 'clients' && <ClientsView 
                            clients={clients} 
                            setClients={setClients} 
                            sgrs={sgrs} 
                            products={products}
                            triggerNewClient={triggerNewClient} 
                            setTriggerNewClient={setTriggerNewClient}
                            preSelectedClient={preSelectedClient} 
                            clearPreSelectedClient={clearPreSelectedClient}
                            documentRequirements={uniqueDocumentRequirements}
                            onAddDocument={handleAddDocument}
                        />}

                        {view === 'agenda' && <AgendaView clients={clients} onUpdateClient={handleUpdateClient} />}
                        {view === 'products' && <ProductsView products={products} setProducts={setProducts} />}
                        
                        {view === 'sgr' && <SGRView 
                            sgrs={sgrs} 
                            clients={clients}
                            onAddSgr={handleAddSgr}
                            onUpdateSgr={handleUpdateSgr}
                            onDeleteSgr={handleDeleteSgr}
                            onAddItemToChecklist={handleAddItemToChecklist}
                            onUpdateChecklistItem={handleUpdateChecklistItem}
                            onDeleteChecklistItem={handleDeleteChecklistItem}
                        />}
                        
                        {view === 'campaigns' && <CampaignsView allClients={clients} onUpdateClient={handleUpdateClient} campaigns={campaigns} setCampaigns={setCampaigns} onNavigateToClient={navigateToClient} />}
                    </main>
                </div>
            </div>
            {showImportOnStartup && <ImportOnStartupModal onImport={triggerImport} onStartNew={() => setShowImportOnStartup(false)} />}
        </>
    );
}





