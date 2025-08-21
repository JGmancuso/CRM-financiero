import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users as FunnelIcon, Briefcase, Shield, Megaphone, Upload, Download, Calendar, Tag } from 'lucide-react';
import FunnelView from './views/FunnelView';
import ClientsView from './views/ClientsView';
import DashboardView from './views/DashboardView';
import SGRView from './views/SGRView';
import CampaignsView from './views/CampaignsView';
import AgendaView from './views/AgendaView';
import ProductsView from './views/ProductsView';
import { initialData } from './data';

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

const APP_DATA_VERSION = '3.0';

export default function App() {
    const [clients, setClients] = useState([]);
    const [negocios, setNegocios] = useState([]);
    const [sgrs, setSgrs] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [products, setProducts] = useState([]);
    const [view, setView] = useState('funnel');
    const [lastSaved, setLastSaved] = useState(null);

    useEffect(() => {
        let finalData = initialData;
        try {
            const savedJSON = localStorage.getItem('crm-data');
            if (savedJSON) {
                const savedObject = JSON.parse(savedJSON);
                if (savedObject.version === APP_DATA_VERSION && savedObject.data) {
                    finalData = savedObject.data;
                }
            }
        } catch (error) { console.error("Error al cargar datos:", error); }

        setNegocios(finalData.negocios || []);
        setClients(finalData.clients || []);
        setSgrs(finalData.sgrs || []);
        setCampaigns(finalData.campaigns || []);
        setProducts(finalData.products || []);
    }, []);

    useEffect(() => {
        const dataToSave = { 
            version: APP_DATA_VERSION, 
            data: { clients, negocios, sgrs, campaigns, products } 
        };
        localStorage.setItem('crm-data', JSON.stringify(dataToSave));
        setLastSaved(new Date());
    }, [clients, negocios, sgrs, campaigns, products]);

    const handleExport = () => {
        const dataToExport = { 
            version: APP_DATA_VERSION, 
            data: { clients, negocios, sgrs, campaigns, products } 
        };
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
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (importedData.data && importedData.data.negocios && importedData.data.clients) {
                    setNegocios(importedData.data.negocios);
                    setClients(importedData.data.clients);
                    setSgrs(importedData.data.sgrs || []);
                    setCampaigns(importedData.data.campaigns || []);
                    setProducts(importedData.data.products || []);
                    alert('Datos del backup importados correctamente.');
                } else {
                    alert('El archivo de backup no tiene el formato correcto (requiere "negocios" y "clients").');
                }
            } catch (error) {
                alert('Error al leer el archivo. Asegúrate de que sea un backup válido.');
                console.error("Error en importación:", error);
            }
        };
        reader.readAsText(file);
        event.target.value = null;
    };

    const triggerImport = () => {
        document.getElementById('import-file-input').click();
    };

    const handleAddClientAndBusiness = (clientFormData) => {
        const { motivo, montoAproximado, observaciones, ...clientDetails } = clientFormData;
        const newClient = {
            ...clientDetails,
            id: `client-${Date.now()}`,
            qualifications: [], activities: [], documents: [], financing: []
        };
        const newBusiness = {
            id: `negocio-${newClient.id}`,
            nombre: motivo || `Oportunidad para ${newClient.name}`,
            estado: 'PROSPECTO',
            montoSolicitado: parseFloat(montoAproximado) || 0,
            fechaProximoSeguimiento: new Date().toISOString(),
            history: [{
                date: new Date().toISOString(),
                type: 'Creación de Negocio',
                reason: observaciones || 'Creación inicial.'
            }],
            cliente: {
                id: newClient.id,
                nombre: newClient.name,
                cuit: newClient.cuit
            }
        };
        setClients(prevClients => [...prevClients, newClient]);
        setNegocios(prevNegocios => [...prevNegocios, newBusiness]);
        alert(`Cliente "${newClient.name}" y su primer negocio fueron creados.`);
        setView('funnel');
    };

    const handleUpdateNegocio = (updatedNegocio) => {
        setNegocios(prevNegocios =>
            prevNegocios.map(n => n.id === updatedNegocio.id ? updatedNegocio : n)
        );
        setClients(prevClients => 
            prevClients.map(c => {
                if (c.id === updatedNegocio.cliente.id) {
                    return { ...c, status: updatedNegocio.estado };
                }
                return c;
            })
        );
    };

    const handleUpdateClient = (updatedClient) => {
        setClients(prevClients =>
            prevClients.map(c => c.id === updatedClient.id ? updatedClient : c)
        );
        setNegocios(prevNegocios =>
            prevNegocios.map(n => {
                if (n.cliente.id === updatedClient.id) {
                    return { ...n, cliente: { ...n.cliente, nombre: updatedClient.name, cuit: updatedClient.cuit }};
                }
                return n;
            })
        );
    };
    
    const handleAddDocument = (clientId, newDocument) => {
        setClients(prevClients => 
            prevClients.map(client => {
                if (client.id === clientId) {
                    const updatedDocuments = [...(client.documents || []), { id: `doc-${Date.now()}`, ...newDocument, uploadDate: new Date().toISOString() }];
                    return { ...client, documents: updatedDocuments };
                }
                return client;
            })
        );
    };
    
    const handleAddSgr = (newSgrData) => {
        const newSgr = { 
            ...newSgrData, 
            id: `sgr-${Date.now()}`
        };
        setSgrs(prevSgrs => [...prevSgrs, newSgr]);
    };

    const handleUpdateSgr = (updatedSgr) => {
        setSgrs(prevSgrs => prevSgrs.map(s => s.id === updatedSgr.id ? updatedSgr : s));
    };

    const handleDeleteSgr = (sgrId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta entidad SGR?')) {
            setSgrs(prevSgrs => prevSgrs.filter(s => s.id !== sgrId));
        }
    };

    return (
        <div className="bg-gray-100 font-sans min-h-screen flex">
            <aside className="w-20 bg-gray-800 text-white flex flex-col items-center py-4">
                 <div className="space-y-6 flex-grow">
                    <button onClick={() => setView('dashboard')} className={`p-3 rounded-lg ${view === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Panel de Inicio"><LayoutDashboard /></button>
                    <button onClick={() => setView('funnel')} className={`p-3 rounded-lg ${view === 'funnel' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Embudo de Negocios"><FunnelIcon /></button>
                    <button onClick={() => setView('clients')} className={`p-3 rounded-lg ${view === 'clients' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Clientes"><Briefcase /></button>
                    <button onClick={() => setView('agenda')} className={`p-3 rounded-lg ${view === 'agenda' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Agenda"><Calendar /></button>
                    <button onClick={() => setView('products')} className={`p-3 rounded-lg ${view === 'products' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Productos"><Tag /></button>
                    <button onClick={() => setView('sgr')} className={`p-3 rounded-lg ${view === 'sgr' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Entidades de Garantía"><Shield /></button>
                    <button onClick={() => setView('campaigns')} className={`p-3 rounded-lg ${view === 'campaigns' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Campañas"><Megaphone /></button>
                </div>
            </aside>
            <div className="flex-1 flex flex-col">
                <Header onImportClick={triggerImport} onExportClick={handleExport} lastSaved={lastSaved} />
                <main className="flex-1 overflow-y-auto">
                    <input type="file" id="import-file-input" style={{ display: 'none' }} accept=".json" onChange={handleImport} />
                    
                    {view === 'dashboard' && <DashboardView clients={clients} />}
                    
                    {view === 'funnel' && <FunnelView 
                        negocios={negocios} 
                        sgrs={sgrs} 
                        onUpdateNegocio={handleUpdateNegocio} 
                        onUpdateSgrQualification={() => {}} 
                    />}
                    
                    {view === 'clients' && <ClientsView 
                        clients={clients}
                        negocios={negocios}
                        sgrs={sgrs}
                        onUpdateNegocio={handleUpdateNegocio}
                        onSaveClient={handleUpdateClient}
                        onAddClientAndBusiness={handleAddClientAndBusiness}
                        onAddDocument={handleAddDocument}
                        onDeleteClient={handleDeleteSgr}
                        onAddNewBusiness={() => alert('Función para nuevo negocio no implementada.')}
                    />}

                    {/* --- CAMBIO REALIZADO AQUÍ --- */}
                    
                    {view === 'sgr' && <SGRView 
                        sgrs={sgrs}
                        onAddSgr={handleAddSgr}
                        onUpdateSgr={handleUpdateSgr}
                        onDeleteSgr={handleDeleteSgr}
                    />}
                    
                    
                    {view === 'agenda' && <AgendaView clients={clients} />}
                    {view === 'products' && <ProductsView products={products} setProducts={setProducts} />}
                    {view === 'campaigns' && <CampaignsView allClients={clients} sgrs={sgrs} onNavigateToClient={() => {}} />}
                </main>
            </div>
        </div>
    );
}