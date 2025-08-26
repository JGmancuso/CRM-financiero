import React, { useState, useEffect } from 'react';
import { Building, User, Edit, Trash2, PlusCircle, FileText, Landmark, Shield, Paperclip, BarChart2, CheckSquare, Clock } from 'lucide-react';
import { FUNNEL_STAGES } from '../../data';
import { useData } from '../../context/DataContext'; // <-- 1. Importamos el hook useData

// Importamos los componentes de las pestañas
import SummaryTab from '../tabs/SummaryTab';
import DebtorStatusTab from '../tabs/DebtorStatusTab';
import QualificationsTab from '../tabs/QualificationsTab';
import DocumentsTab from '../tabs/DocumentsTab';
import InvestmentTab from '../tabs/InvestmentTab';
import ActivitiesTab from '../tabs/ActivitiesTab';
import HistoryTab from '../tabs/HistoryTab';
import NewBusinessModal from '../modals/NewBusinessModal';

// 👇 2. Simplificamos los props. Ya no necesitamos recibir todas las funciones 'on...'.
export default function ClientDetail({ client, negocio, onEdit, onDelete }) {
    
    const { dispatch, state } = useData(); // <-- 3. Obtenemos dispatch y el estado global
    const [activeTab, setActiveTab] = useState('resumen');
    const [showNewBusinessModal, setShowNewBusinessModal] = useState(false);

    useEffect(() => { setActiveTab('resumen'); }, [client]);
    
    if (!client) {
        return <div className="p-6 text-center text-gray-500">Por favor, selecciona un cliente de la lista.</div>;
    }
    
    // 👇 4. Modificamos los "handlers" para que usen dispatch
    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        if (negocio && newStatus !== negocio.estado) {
            dispatch({ 
                type: 'UPDATE_NEGOCIO_STAGE', 
                payload: { ...negocio, estado: newStatus } 
            });
        }
    };
    
    const handleSaveNewBusiness = (businessData) => {
        const displayName = client.name || client.nombre;
        dispatch({
            type: 'ADD_NEW_BUSINESS',
            payload: {
                client: { id: client.id, nombre: displayName, cuit: client.cuit },
                businessData: businessData
            }
        });
        setShowNewBusinessModal(false);
        alert(`Nuevo negocio creado con éxito para ${displayName}.`);
    };

    const tabs = [
        { id: 'resumen', label: 'Resumen', icon: FileText },
        // ... (el array de tabs no cambia)
    ];

    const renderActiveTab = () => {
        // Para una refactorización completa, estos componentes de pestañas también deberían usar
        // el hook `useData` en lugar de recibir las funciones por props.
        // Por ahora, los dejamos así para solucionar el error principal.
        switch (activeTab) {
            case 'resumen': return <SummaryTab client={client} allClients={state.clients} />;
            case 'deudores': return <DebtorStatusTab client={client} />;
            case 'calificaciones': return <QualificationsTab client={client} />;
            case 'documentos': return <DocumentsTab client={client} />;
            case 'inversiones': return <InvestmentTab client={client} />;
            case 'actividades': return <ActivitiesTab client={client} />;
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
                 {/* ... (la barra de pestañas no cambia) ... */}
            </div>
            
            <div>{renderActiveTab()}</div>

            {/* 👇 5. El modal ahora llama a nuestra nueva función handleSaveNewBusiness */}
            {showNewBusinessModal && (
                <NewBusinessModal 
                    client={client} 
                    onSave={handleSaveNewBusiness} 
                    onClose={() => setShowNewBusinessModal(false)} 
                />
            )}
        </div>
    );
}