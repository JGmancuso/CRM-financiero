import React, { useState, useEffect } from 'react';
import { Building, User, Edit, Trash2, PlusCircle, FileText, Landmark, Shield, Paperclip, BarChart2, DollarSign, CheckSquare, Clock } from 'lucide-react';
import { FUNNEL_STAGES } from '../../data';
import InputField from '../common/InputField';

import SummaryTab from '../tabs/SummaryTab';
import DebtorStatusTab from '../tabs/DebtorStatusTab';
import QualificationsTab from '../tabs/QualificationsTab';
import DocumentsTab from '../tabs/DocumentsTab';
import InvestmentTab from '../tabs/InvestmentTab';
import FinancingTab from '../tabs/FinancingTab';
import ActivitiesTab from '../tabs/ActivitiesTab';
import HistoryTab from '../tabs/HistoryTab';
import ActivityModal from '../modals/ActivityModal';
import FinancingModal from '../modals/FinancingModal';
import DocumentViewerModal from '../modals/DocumentViewerModal';
import QualificationModal from '../modals/QualificationModal';


const NewBusinessModal = ({ client, onSave, onClose }) => {
    const [businessData, setBusinessData] = useState({
        motivo: '',
        montoAproximado: '',
        observaciones: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'montoAproximado' 
            ? value === '' ? '' : parseFloat(value)
            : value;
        setBusinessData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = () => {
        if (!businessData.motivo) {
            alert('El motivo es obligatorio.');
            return;
        }
        const dataToSave = {
            ...businessData,
            montoAproximado: Number(businessData.montoAproximado) || 0
        };
        onSave(client.id, dataToSave);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Nuevo Negocio para {client.nombre}</h2>
                <div className="space-y-4">
                    <InputField name="motivo" label="Motivo del Nuevo Negocio" value={businessData.motivo} onChange={handleChange} required />
                    <InputField name="montoAproximado" label="Monto Aproximado" type="number" value={businessData.montoAproximado} onChange={handleChange} />
                    <InputField name="observaciones" label="Observaciones Iniciales" value={businessData.observaciones} onChange={handleChange} textarea />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Crear Negocio</button>
                </div>
            </div>
        </div>
    );
};


export default function ClientDetail({ 
    client, 
    clients, // Recibe la lista completa
    negocio, 
    onUpdateNegocio, 
    onEdit, 
    onDelete, 
    onAddNewBusiness, 
    sgrs,
    onSaveActivity, 
    onToggleActivity, 
    onSaveFinancing, 
    onSaveQualification, 
    onUpdateDebtorStatus, 
    documentRequirements, 
    onAddDocument 
}) {
    const [activeTab, setActiveTab] = useState('resumen');
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showFinancingModal, setShowFinancingModal] = useState(false);
    const [showQualificationModal, setShowQualificationModal] = useState(false);
    const [editingQualification, setEditingQualification] = useState(null);
    const [viewingDoc, setViewingDoc] = useState(null);
    const [showNewBusinessModal, setShowNewBusinessModal] = useState(false);

    useEffect(() => { setActiveTab('resumen'); }, [client]);
    
    if (!client) {
        return <div className="p-6">Por favor, selecciona un cliente.</div>;
    }

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        if (negocio && newStatus !== negocio.estado) {
            const updatedNegocio = {
                ...negocio,
                estado: newStatus,
                history: [
                    ...(negocio.history || []),
                    {
                        date: new Date().toISOString(),
                        type: `Cambio de Etapa (Manual): ${FUNNEL_STAGES[newStatus]}`,
                        reason: 'Actualizado desde el detalle del cliente.'
                    }
                ]
            };
            onUpdateNegocio(updatedNegocio);
        }
    };

    const tabs = [
        { id: 'resumen', label: 'Resumen', icon: FileText },
        { id: 'deudores', label: 'Sit. Deudores', icon: Landmark },
        { id: 'calificaciones', label: 'Calificaciones', icon: Shield },
        { id: 'documentos', label: 'Documentos', icon: Paperclip },
        { id: 'financiacion', label: 'Financiación', icon: DollarSign },
        { id: 'actividades', label: 'Actividades', icon: CheckSquare },
        { id: 'historial', label: 'Historial', icon: Clock },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center mb-2">
                        {client.type === 'juridica' ? <Building className="text-blue-600 mr-3" size={32} /> : <User className="text-blue-600 mr-3" size={32} />}
                        <h2 className="text-3xl font-bold text-gray-800">{client.nombre}</h2>
                    </div>
                    {negocio ? (
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-500 mr-2">Estado del Negocio:</span>
                            <select
                                value={negocio.estado}
                                onChange={handleStatusChange}
                                className="bg-gray-100 border-gray-300 rounded-md text-sm font-semibold text-gray-700 p-1 focus:ring-2 focus:ring-blue-500"
                            >
                                {Object.entries(FUNNEL_STAGES).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Este cliente no tiene un negocio activo en el embudo.</p>
                    )}
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => setShowNewBusinessModal(true)} className="p-2 text-green-600 hover:bg-green-100 rounded-full transition" title="Nuevo Negocio">
                        <PlusCircle size={20} />
                    </button>
                    <button onClick={() => onEdit(client)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition" title="Editar Cliente"><Edit size={20} /></button>
                    <button onClick={() => onDelete(client.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition" title="Eliminar Cliente"><Trash2 size={20} /></button>
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
            
            <div>
                {activeTab === 'resumen' && <SummaryTab client={client} allClients={clients} />}
                {activeTab === 'deudores' && <DebtorStatusTab client={client} onUpdateDebtorStatus={onUpdateDebtorStatus} />}
                {activeTab === 'calificaciones' && <QualificationsTab client={client} onAddQualification={()=>{}} />}
                {activeTab === 'documentos' && <DocumentsTab client={client} onViewDocument={()=>{}} documentRequirements={documentRequirements} onAddDocument={onAddDocument} />}
                {activeTab === 'financiacion' && <FinancingTab client={client} onAddInstrument={()=>{}} />}
                {activeTab === 'actividades' && <ActivitiesTab client={client} onAddActivity={()=>{}} onToggleActivity={onToggleActivity} />}
                {activeTab === 'historial' && <HistoryTab history={negocio?.history || client.history || []} />}
            </div>

            {showActivityModal && <ActivityModal onClose={() => setShowActivityModal(false)} onSave={(activity) => { onSaveActivity(activity); setShowActivityModal(false); }} activityToEdit={editingActivity} />}
            {showFinancingModal && <FinancingModal onClose={() => setShowFinancingModal(false)} onSave={(instrument) => { onSaveFinancing(instrument); setShowFinancingModal(false); }} clientQualifications={client.qualifications || []} />}
            {viewingDoc && <DocumentViewerModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />}
            {showQualificationModal && <QualificationModal onClose={() => setShowQualificationModal(false)} onSave={(q) => { onSaveQualification(q); setShowQualificationModal(false); }} qualificationToEdit={editingQualification} sgrs={sgrs} />}
            {showNewBusinessModal && <NewBusinessModal client={client} onSave={onAddNewBusiness} onClose={() => setShowNewBusinessModal(false)} />}
        </div>
    );
}