import React, { useState, useEffect } from 'react';
import { Building, User, Edit, Trash2, PlusCircle, FileText, Landmark, Shield, Paperclip, BarChart2, CheckSquare, Clock } from 'lucide-react';
import { FUNNEL_STAGES } from '../../data';

// Importamos los componentes que extrajimos y el resto de las pestañas
import SummaryTab from '../tabs/SummaryTab';
import DebtorStatusTab from '../tabs/DebtorStatusTab';
import QualificationsTab from '../tabs/QualificationsTab';
import DocumentsTab from '../tabs/DocumentsTab';
import InvestmentTab from '../tabs/InvestmentTab';
import ActivitiesTab from '../tabs/ActivitiesTab';
import HistoryTab from '../tabs/HistoryTab';
// El resto de los imports están bien
import NewBusinessModal from '../modals/NewBusinessModal'; // <-- Importamos el nuevo modal

export default function ClientDetail({ 
    client, clients, negocio, onUpdateNegocio, onEdit, onDelete, onAddNewBusiness, sgrs,
    onSaveActivity, onToggleActivity, onUpdateClient, documentRequirements, onAddDocument, onUpdateDebtorStatus
}) {
    const [activeTab, setActiveTab] = useState('resumen');
    const [showNewBusinessModal, setShowNewBusinessModal] = useState(false);

    useEffect(() => { setActiveTab('resumen'); }, [client]);
    
    if (!client) {
        return <div className="p-6 text-center text-gray-500">Por favor, selecciona un cliente de la lista.</div>;
    }
    
    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        if (negocio && newStatus !== negocio.estado) {
            onUpdateNegocio({ ...negocio, estado: newStatus });
        }
    };
    
    const tabs = [
        { id: 'resumen', label: 'Resumen', icon: FileText },
        { id: 'deudores', label: 'Sit. Deudores', icon: Landmark },
        { id: 'calificaciones', label: 'Calificaciones', icon: Shield },
        { id: 'documentos', label: 'Documentos', icon: Paperclip },
        { id: 'inversiones', label: 'Inversiones', icon: BarChart2 },
        { id: 'actividades', label: 'Actividades', icon: CheckSquare },
        { id: 'historial', label: 'Historial', icon: Clock },
    ];

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'resumen': return <SummaryTab client={client} allClients={clients} />;
            case 'deudores': return <DebtorStatusTab client={client} onUpdateDebtorStatus={onUpdateDebtorStatus} />;
            case 'calificaciones': return <QualificationsTab client={client} onAddQualification={()=>{}} />;
            case 'documentos': return <DocumentsTab client={client} documentRequirements={documentRequirements} onAddDocument={onAddDocument} />;
            case 'inversiones': return <InvestmentTab client={client} onUpdateClient={onUpdateClient} />;
            case 'actividades': return <ActivitiesTab client={client} onSaveActivity={onSaveActivity} onToggleActivity={onToggleActivity} />;
            case 'historial': return <HistoryTab history={negocio?.history || client.history || []} />;
            default: return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center mb-2">
                        {client.type === 'juridica' ? <Building className="text-blue-600 mr-3" size={32} /> : <User className="text-blue-600 mr-3" size={32} />}
                        <h2 className="text-3xl font-bold text-gray-800">{client.nombre || client.name}</h2>
                    </div>
                    {negocio ? (
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-500 mr-2">Estado del Negocio:</span>
                            <select value={negocio.estado} onChange={handleStatusChange} className="bg-gray-100 rounded-md text-sm p-1">
                                {Object.entries(FUNNEL_STAGES).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}
                            </select>
                        </div>
                    ) : (<p className="text-sm text-gray-400">Este cliente no tiene un negocio activo.</p>)}
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => setShowNewBusinessModal(true)} className="p-2 text-green-600 hover:bg-green-100 rounded-full" title="Nuevo Negocio"><PlusCircle size={20}/></button>
                    <button onClick={() => onEdit(client)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full" title="Editar Cliente"><Edit size={20} /></button>
                    <button onClick={() => onDelete(client.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" title="Eliminar Cliente"><Trash2 size={20} /></button>
                </div>
            </div>
            
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 text-sm whitespace-nowrap ${activeTab === tab.id ? 'font-semibold border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'}`}>
                           <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div>{renderActiveTab()}</div>

            {showNewBusinessModal && <NewBusinessModal client={client} onSave={onAddNewBusiness} onClose={() => setShowNewBusinessModal(false)} />}
        </div>
    );
}