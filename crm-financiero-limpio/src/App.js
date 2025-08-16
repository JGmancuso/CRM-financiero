// src/App.js

import React, { useState, useEffect, useMemo } from 'react';
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

const APP_DATA_VERSION = '2.0';

export default function App() {
    const [clients, setClients] = useState(() => {
        try {
            const savedJSON = localStorage.getItem('crm-clients');
            if (savedJSON) {
                const savedObject = JSON.parse(savedJSON);
                if (savedObject.version === APP_DATA_VERSION && Array.isArray(savedObject.data)) {
                    return savedObject.data;
                }
            }
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        }
        console.warn("Versión de datos de clientes antigua o inválida. Cargando datos iniciales.");
        return initialClients;
    });

    const [sgrs, setSgrs] = useState(() => {
        try {
            const savedJSON = localStorage.getItem('crm-sgrs');
            if (savedJSON) {
                const savedObject = JSON.parse(savedJSON);
                if (savedObject.version === APP_DATA_VERSION && Array.isArray(savedObject.data)) {
                    return savedObject.data;
                }
            }
        } catch (error) {
            console.error("Error al cargar SGRs:", error);
        }
        console.warn("Versión de datos de SGRs antigua o inválida. Cargando datos iniciales.");
        return initialSGRs;
    });

    const [campaigns, setCampaigns] = useState(() => {
        try {
            const savedData = localStorage.getItem('crm-campaigns');
            return savedData ? JSON.parse(savedData) : initialCampaigns;
        } catch (error) {
            return initialCampaigns;
        }
    });

    const [products, setProducts] = useState(() => {
        try {
            const savedData = localStorage.getItem('crm-products');
            return savedData ? JSON.parse(savedData) : initialProducts;
        } catch (error) {
            return initialProducts;
        }
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
        const dataToSave = { version: APP_DATA_VERSION, data: clients };
        localStorage.setItem('crm-clients', JSON.stringify(dataToSave));
        setLastSaved(new Date());
    }, [clients]);

    useEffect(() => {
        const dataToSave = { version: APP_DATA_VERSION, data: sgrs };
        localStorage.setItem('crm-sgrs', JSON.stringify(dataToSave));
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

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.onRequestDataForQuit(() => {
                const dataToExport = { clients, sgrs, campaigns, products, version: '1.0' };
                const dataStr = JSON.stringify(dataToExport, null, 2);
                window.electronAPI.sendQuitData(dataStr);
            });
        }
    }, [clients, sgrs, campaigns, products]);

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
    
    const handleStartQualification = (clientId, sgrNames, notes) => {
        setClients(prevClients => 
            prevClients.map(client => {
                if (client.id === clientId) {
                    const newQualifications = sgrNames.map(sgrName => ({
                        id: `q-${Date.now()}-${sgrName.replace(/\s+/g, '')}`,
                        sgrName: sgrName,
                        status: FUNNEL_STAGES.in_qualification,
                        submissionDate: new Date().toISOString(),
                        notes: [{ date: new Date().toISOString(), note: notes || 'Inicio de calificación.' }],
                        lineAmount: 0,
                        destination: '',
                        lineExpiryDate: ''
                    }));
                    
                    const nextBusinessDate = (date) => {
                        let nextDay = new Date(date);
                        let daysToAdd = 3;
                        while (daysToAdd > 0) {
                            nextDay.setDate(nextDay.getDate() + 1);
                            if (nextDay.getDay() !== 0 && nextDay.getDay() !== 6) {
                                daysToAdd--;
                            }
                        }
                        return nextDay;
                    };

                    const followUpDate = nextBusinessDate(new Date());

                    const newFollowUpActivity = {
                        id: `act-${Date.now()}-followup`,
                        type: 'task',
                        title: `Seguimiento de calificación para: ${client.name}`,
                        date: followUpDate.toISOString(),
                        note: `Verificar el estado de la calificación de ${client.name} enviada a ${sgrNames.join(', ')}.`,
                        completed: false
                    };
                    
                    const updatedClient = {
                         ...client,
                         status: FUNNEL_STAGES.in_qualification,
                         qualifications: [...(client.qualifications || []), ...newQualifications],
                         history: [...(client.history || []), {
                             date: new Date().toISOString(),
                             type: 'Funnel Change',
                             note: `Enviado a calificar a: ${sgrNames.join(', ')}. ${notes || ''}`
                         }],
                         activities: [...(client.activities || []), newFollowUpActivity],
                         lastUpdate: new Date().toISOString()
                    };
                    return updatedClient;
                }
                return client;
            })
        );
    };

    const updateSgrOutcomes = (clientId, updatedQualifications) => {
        setClients(prevClients => prevClients.map(client => {
            if (client.id === clientId) {
                const newFinancing = [];
                const updatedQualificationsMap = new Map(updatedQualifications.map(q => [q.id, q]));
                
                const qualificationsToProcess = client.qualifications.filter(q => updatedQualificationsMap.has(q.id));
                const otherQualifications = client.qualifications.filter(q => !updatedQualificationsMap.has(q.id));

                const processedQualifications = qualificationsToProcess.map(q => {
                    const newQ = updatedQualificationsMap.get(q.id);
                    const updatedQ = {
                        ...q,
                        status: newQ.status,
                        notes: newQ.notes,
                        lineAmount: newQ.lineAmount,
                        destination: newQ.destination,
                        lineExpiryDate: newQ.lineExpiryDate,
                        resolutionDate: new Date().toISOString()
                    };
                    
                    if (newQ.status === FUNNEL_STAGES.qualified) {
                        newFinancing.push({
                            id: `fin-${Date.now()}-${updatedQ.id}`,
                            instrument: 'Línea Calificada',
                            sgr: updatedQ.sgrName,
                            monto: updatedQ.lineAmount,
                            destino: updatedQ.destination,
                            vencimiento: updatedQ.lineExpiryDate,
                            aprobacionDate: new Date().toISOString()
                        });
                    }
                    return updatedQ;
                });

                const allQualifications = [...otherQualifications, ...processedQualifications];
                const pendingQualifications = allQualifications.filter(q => q.status === FUNNEL_STAGES.in_qualification);
                const completedQualifications = allQualifications.filter(q => 
                    q.status === FUNNEL_STAGES.qualified || q.status === FUNNEL_STAGES.lost
                );
                
                let newOverallStatus = client.status;
                if (pendingQualifications.length === 0 && client.status === FUNNEL_STAGES.in_qualification) {
                    const hasQualified = completedQualifications.some(q => q.status === FUNNEL_STAGES.qualified);
                    newOverallStatus = hasQualified ? FUNNEL_STAGES.qualified : FUNNEL_STAGES.lost;
                }

                return {
                    ...client,
                    status: newOverallStatus,
                    qualifications: pendingQualifications,
                    history: [...(client.history || []), {
                        date: new Date().toISOString(),
                        type: 'Funnel Change',
                        note: `Se actualizaron los resultados de calificación.`
                    }],
                    financing: [...(client.financing || []), ...newFinancing],
                    lastUpdate: new Date().toISOString()
                };
            }
            return client;
        }));
    };
    
    const handleUpdateClientStatusAndNotes = (clientId, newStatus, notes, nextStep) => {
        setClients(prevClients => prevClients.map(client => {
            if (client.id === clientId) {
                const nextBusinessDate = (date) => {
                    let nextDay = new Date(date);
                    let daysToAdd = 3;
                    while (daysToAdd > 0) {
                        nextDay.setDate(nextDay.getDate() + 1);
                        if (nextDay.getDay() !== 0 && nextDay.getDay() !== 6) {
                            daysToAdd--;
                        }
                    }
                    return nextDay;
                };

                const followUpDate = nextBusinessDate(new Date());
                const newFollowUpActivity = {
                    id: `act-${Date.now()}-followup`,
                    type: 'task',
                    title: nextStep || `Próximos pasos (${newStatus}) para: ${client.name}`,
                    date: followUpDate.toISOString(),
                    note: notes || 'Seguimiento de cambio de estado.',
                    completed: false
                };
                
                return {
                    ...client, 
                    status: newStatus, 
                    lastUpdate: new Date().toISOString(),
                    activities: [...(client.activities || []), newFollowUpActivity],
                    history: [...(client.history || []), {
                        date: new Date().toISOString(),
                        type: 'Status Change',
                        note: `Cambió de estado a ${newStatus}. ${notes || ''}`
                    }]
                };
            }
            return client;
        }));
    };
    
    const handleUpdateQualificationStatus = (clientId, qualificationId, newStatus, details) => {
        setClients(prevClients => 
            prevClients.map(client => {
                if (client.id === clientId) {
                    const updatedQualifications = client.qualifications.map(q => {
                        if (q.id === qualificationId) {
                            const updatedQ = { ...q, status: newStatus, resolutionDate: new Date().toISOString() };
                            
                            if (details.notes) {
                                updatedQ.notes = [...(q.notes || []), { date: new Date().toISOString(), note: details.notes }];
                            }
                            if (newStatus === FUNNEL_STAGES.qualified && details.qualificationDetails) {
                                updatedQ.lineAmount = details.qualificationDetails.lineAmount;
                                updatedQ.destination = details.qualificationDetails.destination;
                                updatedQ.lineExpiryDate = details.qualificationDetails.lineExpiryDate;
                            }
                            return updatedQ;
                        }
                        return q;
                    });
                    
                    const newFinancing = (newStatus === FUNNEL_STAGES.qualified && details.qualificationDetails) ? {
                        id: `fin-${Date.now()}-${qualificationId}`,
                        instrument: 'Línea Calificada',
                        sgr: client.qualifications.find(q => q.id === qualificationId)?.sgrName,
                        monto: details.qualificationDetails.lineAmount,
                        destino: details.qualificationDetails.destination,
                        vencimiento: details.qualificationDetails.lineExpiryDate,
                        aprobacionDate: new Date().toISOString()
                    } : null;
                    
                    return {
                        ...client, 
                        qualifications: updatedQualifications, 
                        lastUpdate: new Date().toISOString(),
                        financing: newFinancing ? [...(client.financing || []), newFinancing] : client.financing
                    };
                }
                return client;
            })
        );
    };

    const handleExport = () => {
        const dataToExport = { clients, sgrs, campaigns, products, version: '1.0' };
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const date = new Date();
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        link.download = `crm_backup_${dateString}.json`;

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
    };

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
                    <Header onImportClick={triggerImport} onExportClick={handleExport} lastSaved={lastSaved} />
                    <main className="flex-1 overflow-y-auto">
                        <input type="file" id="import-file-input" style={{ display: 'none' }} accept=".json" onChange={handleImport} />
                        {view === 'dashboard' && <DashboardView clients={clients} onUpdateClient={handleUpdateClient} setView={setView} onNewClient={() => { setView('clients'); setTriggerNewClient(true); }} onNavigateToClient={navigateToClient} />}
                        
                        {view === 'funnel' && <FunnelView 
                            clients={clients} 
                            onNavigateToClient={navigateToClient} 
                            onUpdateClientStatus={handleUpdateClientStatusAndNotes}
                            sgrs={sgrs} 
                            handleStartQualification={handleStartQualification}
                            updateSgrOutcomes={updateSgrOutcomes}
                        />}
                        
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
                            handleStartQualification={handleStartQualification}
                            onUpdateQualificationStatus={handleUpdateQualificationStatus}
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