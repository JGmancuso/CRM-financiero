import React, { useState, useEffect } from 'react';
import { Building, User, Edit, Trash2, FileText, Shield, Paperclip, BarChart2, DollarSign, CheckSquare, Clock, Landmark } from 'lucide-react';
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
import DocumentUploadModal from '../modals/DocumentUploadModal';
import DocumentViewerModal from '../modals/DocumentViewerModal';
import QualificationModal from '../modals/QualificationModal';
import { initialSGRs } from '../../data';

export default function ClientDetail({ client, onEdit, onDelete, onSaveActivity, onToggleActivity, onSaveFinancing, onSaveDocument, onSaveQualification, onUpdateDebtorStatus }) {
    const [activeTab, setActiveTab] = useState('resumen');
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showFinancingModal, setShowFinancingModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [showQualificationModal, setShowQualificationModal] = useState(false);
    const [editingQualification, setEditingQualification] = useState(null);
    const [viewingDoc, setViewingDoc] = useState(null);

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
            <div>
                {activeTab === 'resumen' && <SummaryTab client={client} />}
                {activeTab === 'deudores' && <DebtorStatusTab client={client} onUpdateDebtorStatus={onUpdateDebtorStatus} />}
                {activeTab === 'calificaciones' && <QualificationsTab client={client} onAddQualification={handleShowQualificationModal} />}
                {activeTab === 'documentos' && <DocumentsTab client={client} onAddDocument={() => setShowDocumentModal(true)} onViewDocument={handleDocumentClick} />}
                {activeTab === 'inversion' && <InvestmentTab client={client} />}
                {activeTab === 'financiacion' && <FinancingTab client={client} onAddInstrument={() => setShowFinancingModal(true)} />}
                {activeTab === 'actividades' && <ActivitiesTab client={client} onAddActivity={handleShowActivityModal} onToggleActivity={onToggleActivity} />}
                {activeTab === 'historial' && <HistoryTab client={client} />}
            </div>
            {showActivityModal && <ActivityModal onClose={() => setShowActivityModal(false)} onSave={(activity) => { onSaveActivity(activity); setShowActivityModal(false); }} activityToEdit={editingActivity} />}
            {showFinancingModal && <FinancingModal onClose={() => setShowFinancingModal(false)} onSave={(instrument) => { onSaveFinancing(instrument); setShowFinancingModal(false); }} clientQualifications={client.qualifications || []} clientFinancing={client.financing || []} />}
            {showDocumentModal && <DocumentUploadModal onClose={() => setShowDocumentModal(false)} onSave={(doc) => { onSaveDocument(doc); }} />}
            {viewingDoc && <DocumentViewerModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />}
            {showQualificationModal && <QualificationModal onClose={() => setShowQualificationModal(false)} onSave={(q) => { onSaveQualification(q); setShowQualificationModal(false); }} qualificationToEdit={editingQualification} sgrs={initialSGRs} />}
        </div>
    );
}

