// App.js (versión final y refactorizada)

import React, { useState } from 'react';
import { LayoutDashboard, Users as FunnelIcon, Briefcase, Shield, Megaphone, Upload, Download, Calendar, Tag, UserSearch } from 'lucide-react';

// Importamos el hook que nos da acceso al estado global
import { useData } from './context/DataContext';

// Importamos todas las vistas que App va a mostrar
import FunnelView from './views/FunnelView';
import ClientsView from './views/ClientsView';
import DashboardView from './views/DashboardView';
import EntidadesView from './views/EntidadesView'; 
import CampaignsView from './views/CampaignsView';
import AgendaView from './views/AgendaView';
import ProductsView from './views/ProductsView';
import AnalisisNoClientesView from './views/AnalisisNoClientesView';

// El componente Header podría incluso vivir en su propio archivo si quisieras
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
    // Obtenemos todo lo necesario del contexto con una sola línea
    const { state, dispatch, lastSaved } = useData();
    
    // El único estado que le pertenece a App.js es el que controla qué vista se muestra
    const [view, setView] = useState('funnel');

    const handleExport = () => {
        const dataToExport = { version: APP_DATA_VERSION, data: state };
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
                if (importedData.data) {
                    dispatch({ type: 'IMPORT_DATA', payload: importedData.data });
                    alert('Datos del backup importados correctamente.');
                } else {
                    alert('El archivo de backup no tiene el formato correcto.');
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

    return (
        <div className="bg-gray-100 font-sans min-h-screen flex">
            <aside className="w-20 bg-gray-800 text-white flex flex-col items-center py-4">
                 <div className="space-y-6 flex-grow">
                    <button onClick={() => setView('dashboard')} className={`p-3 rounded-lg ${view === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Panel de Inicio"><LayoutDashboard /></button>
                    <button onClick={() => setView('funnel')} className={`p-3 rounded-lg ${view === 'funnel' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Embudo de Negocios"><FunnelIcon /></button>
                    <button onClick={() => setView('agenda')} className={`p-3 rounded-lg ${view === 'agenda' ? 'bg-blue-600' : 'hover:bg-ray-700'}`} title="Agenda"><Calendar /></button>
                    <button onClick={() => setView('clients')} className={`p-3 rounded-lg ${view === 'clients' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Clientes"><Briefcase /></button>
                    <button onClick={() => setView('analisisNoClientes')} className={`p-3 rounded-lg ${view === 'analisisNoClientes' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Análisis No Clientes"><UserSearch /></button>
                    <button onClick={() => setView('products')} className={`p-3 rounded-lg ${view === 'products' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Productos"><Tag /></button>
                    <button onClick={() => setView('sgr')} className={`p-3 rounded-lg ${view === 'sgr' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Entidades de Garantía"><Shield /></button>
                    <button onClick={() => setView('campaigns')} className={`p-3 rounded-lg ${view === 'campaigns' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Campañas"><Megaphone /></button>
                </div>
            </aside>
            <div className="flex-1 flex flex-col">
                <Header onImportClick={triggerImport} onExportClick={handleExport} lastSaved={lastSaved} />
                <main className="flex-1 overflow-y-auto">
                    <input type="file" id="import-file-input" style={{ display: 'none' }} accept=".json" onChange={handleImport} />
                    
                   {view === 'dashboard' && <DashboardView clients={state.clients} negocios={state.negocios} tasks={state.tasks} onNavigateToClient={() => setView('clients')}/>}
                    
                    {view === 'funnel' && <FunnelView negocios={state.negocios} sgrs={state.sgrs} />}
                    
                    {view === 'agenda' && <AgendaView clients={state.clients} tasks={state.tasks} />}
                    
                    {view === 'clients' && <ClientsView clients={state.clients} negocios={state.negocios} sgrs={state.sgrs} />}
                    
                    {view === 'analisisNoClientes' && <AnalisisNoClientesView />}
                    
                    {view === 'sgr' && <EntidadesView />}
                                        
                    {view === 'products' && <ProductsView products={state.products} setProducts={(newProducts) => dispatch({ type: 'SET_PRODUCTS', payload: newProducts })} />}
                    
                    {view === 'campaigns' && <CampaignsView allClients={state.clients} sgrs={state.sgrs} onNavigateToClient={() => {}} />}
                </main>
            </div>
        </div>
    );
}