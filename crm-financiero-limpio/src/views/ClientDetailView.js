import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import ActivityModal from '../modals/ActivityModal';
// Importa las pestañas que necesites
import SummaryTab from './tabs/SummaryTab'; 
import DebtorStatusTab from './tabs/DebtorStatusTab';
import HistoryTab from './tabs/HistoryTab';

// Sub-componente para la pestaña de Actividades
const ActivitiesTab = ({ client, onSaveActivity, onToggleActivity }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);

    const handleOpenModal = (activity = null) => {
        setEditingActivity(activity);
        setIsModalOpen(true);
    };

    const handleSave = (activityData) => {
        // Llama a la función de App.js con el ID del cliente y los datos de la actividad
        onSaveActivity(client.id, activityData);
        setIsModalOpen(false);
        setEditingActivity(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Tareas y Eventos</h3>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    <PlusCircle size={16} className="mr-2" />
                    Nueva Actividad
                </button>
            </div>
            <div className="space-y-3">
                {(client.activities && client.activities.length > 0) ? client.activities.map(activity => (
                    <div key={activity.id} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{activity.description}</p>
                            <p className="text-sm text-gray-500">{new Date(activity.date + 'T00:00:00').toLocaleDateString('es-AR', {timeZone: 'UTC'})}</p>
                        </div>
                        <div>
                            <button onClick={() => handleOpenModal(activity)} className="p-1 text-gray-500 hover:text-blue-600"><Edit size={16}/></button>
                            {/* Aquí iría la lógica para eliminar si la tuvieras */}
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-4">No hay actividades para este cliente.</p>
                )}
            </div>
            {isModalOpen && (
                <ActivityModal 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSave}
                    activityToEdit={editingActivity}
                />
            )}
        </div>
    );
};


export default function ClientDetail({ client, negocio, sgrs, onUpdateNegocio, onEdit, onDelete, onAddDocument, onAddNewBusiness, onSaveActivity, onToggleActivity }) {
    const [activeTab, setActiveTab] = useState('actividades');

    const tabs = [
        // { id: 'resumen', label: 'Resumen', component: <SummaryTab client={client} /> },
        // { id: 'deudores', label: 'Sit. Deudores', component: <DebtorStatusTab client={client} /> },
        { id: 'actividades', label: 'Actividades', component: <ActivitiesTab client={client} onSaveActivity={onSaveActivity} onToggleActivity={onToggleActivity} /> },
        // { id: 'historial', label: 'Historial', component: <HistoryTab client={client} negocio={negocio} /> },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{client.nombre}</h1>
                    <p className="text-gray-500">{client.cuit}</p>
                </div>
                <div>
                    <button onClick={() => onEdit(client)} className="p-2 text-gray-500 hover:text-blue-600"><Edit/></button>
                    <button onClick={() => onDelete(client.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2/></button>
                </div>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-1 border-b-2 font-semibold ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-6">
                {tabs.find(tab => tab.id === activeTab)?.component}
            </div>
        </div>
    );
}