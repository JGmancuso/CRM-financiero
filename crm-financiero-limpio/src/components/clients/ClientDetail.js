// src/components/clients/ClientDetail.js

import React, { useState, useEffect } from 'react';
import { Building, User, Edit, Trash2, FileText, Shield, Paperclip, BarChart2, DollarSign, CheckSquare, Clock, Landmark, PlusCircle } from 'lucide-react';
import SummaryTab from '../tabs/SummaryTab';
import QualificationsTab from '../tabs/QualificationsTab';
import DocumentsTab from '../tabs/DocumentsTab';
import InvestmentTab from '../tabs/InvestmentTab';
import FinancingTab from '../tabs/FinancingTab';
import ActivitiesTab from '../tabs/ActivitiesTab';
import HistoryTab from '../tabs/HistoryTab';
import DebtorStatusTab from '../tabs/DebtorStatusTab';
import ActivityModal from '../modals/ActivityModal';
import FinancingModal from '../modals/FinancingModal';
import DocumentViewerModal from '../modals/DocumentViewerModal';
import QualificationModal from '../modals/QualificationModal';
import { initialSGRs } from '../../data';
import InputField from '../common/InputField';

const NewBusinessModal = ({ client, onSave, onClose }) => {
    const [businessData, setBusinessData] = useState({
        motivo: '',
        montoAproximado: '',
        observaciones: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBusinessData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!businessData.motivo) {
            alert('El motivo es obligatorio.');
            return;
        }
        onSave(client.id, businessData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Nuevo Negocio para {client.name}</h2>
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

export default function ClientDetail({ client, onEdit, onDelete, onSaveActivity, onToggleActivity, onSaveFinancing, onSaveQualification, onUpdateDebtorStatus, documentRequirements, onAddDocument, onAddNewBusiness }) {
    const [activeTab, setActiveTab] = useState('resumen');
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showFinancingModal, setShowFinancingModal] = useState(false);
    const [showQualificationModal, setShowQualificationModal] = useState(false);
    const [editingQualification, setEditingQualification] = useState(null);
    const [viewingDoc, setViewingDoc] = useState(null);
    const [showNewBusinessModal, setShowNewBusinessModal] = useState(false);

    useEffect(() => { setActiveTab('resumen'); }, [client]);

    const handleDocumentClick = (doc) => {
        if (doc.type === 'link') {
            window.open(doc.url, '_blank', 'noopener,noreferrer');
        } else {
            setViewingDoc(doc);
        }
    };
    
    const handleShowQualificationModal = (qualification = null) => {
        setEditingQualification(qualification);
        setShowQualificationModal(true);
    };
    
    const handleShowActivityModal = (activity = null) => {
        setEditingActivity(activity);
        setShowActivityModal(true);
    };

    const tabs = [
        { id: 'resumen', label: 'Resumen', icon: FileText },
        { id: 'deudores', label: 'Sit. Deudores', icon: Landmark },
        { id: 'calificaciones', label: 'Calificaciones', icon: Shield },
        { id: 'documentos', label: 'Documentos', icon: Paperclip },
        { id: 'inversion', label: 'Inversión', icon: BarChart2 },
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
                        <h2 className="text-3xl font-bold text-gray-800">{client.name}</h2>
                    </div>
                    <p className="text-gray-500">{client.industry}</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => setShowNewBusinessModal(true)} className="p-2 text-green-600 hover:bg-green-100 rounded-full transition" title="Nuevo Negocio">
                        <PlusCircle size={20} />
                    </button>
                    <button onClick={() => onEdit(client)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition"><Edit size={20} /></button>
                    <button onClick={() => onDelete(client.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"><Trash2 size={20} /></button>
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
            
            {/* --- CÓDIGO CORREGIDO: VUELTA A LA LÓGICA CLÁSICA DE PESTAÑAS --- */}
            <div>
                {activeTab === 'resumen' && <SummaryTab client={client} />}
                {activeTab === 'deudores' && <DebtorStatusTab client={client} onUpdateDebtorStatus={onUpdateDebtorStatus} />}
                {activeTab === 'calificaciones' && <QualificationsTab client={client} onAddQualification={handleShowQualificationModal} />}
                {activeTab === 'documentos' && <DocumentsTab client={client} onViewDocument={handleDocumentClick} documentRequirements={documentRequirements} onAddDocument={onAddDocument} />}
                {activeTab === 'inversion' && <InvestmentTab client={client} />}
                {activeTab === 'financiacion' && <FinancingTab client={client} onAddInstrument={() => setShowFinancingModal(true)} />}
                {activeTab === 'actividades' && <ActivitiesTab client={client} onAddActivity={handleShowActivityModal} onToggleActivity={onToggleActivity} />}
                {activeTab === 'historial' && <HistoryTab client={client} />}
            </div>

            {showActivityModal && <ActivityModal onClose={() => setShowActivityModal(false)} onSave={(activity) => { onSaveActivity(activity); setShowActivityModal(false); }} activityToEdit={editingActivity} />}
            {showFinancingModal && <FinancingModal onClose={() => setShowFinancingModal(false)} onSave={(instrument) => { onSaveFinancing(instrument); setShowFinancingModal(false); }} clientQualifications={client.qualifications || []} clientFinancing={client.financing || []} />}
            {viewingDoc && <DocumentViewerModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />}
            {showQualificationModal && <QualificationModal onClose={() => setShowQualificationModal(false)} onSave={(q) => { onSaveQualification(q); setShowQualificationModal(false); }} qualificationToEdit={editingQualification} sgrs={initialSGRs} />}
            {showNewBusinessModal && <NewBusinessModal client={client} onSave={onAddNewBusiness} onClose={() => setShowNewBusinessModal(false)} />}
        </div>
    );
}