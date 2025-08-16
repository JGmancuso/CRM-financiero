import React, { useState } from 'react';
import { User, MapPin, Edit, PlusCircle, DollarSign, Activity, Clock } from 'lucide-react';
import ClientModal from '../components/modals/ClientModal';
import SimulationModal from '../components/modals/SimulationModal';
import ActivityModal from '../components/modals/ActivityModal';
import QualificationStatusModal from '../components/modals/QualificationStatusModal';

// NOTA: Este es un nuevo componente para mostrar el detalle completo de un cliente.
// Se asume que la estructura de datos del cliente ahora incluye:
// - contactPerson: 'string'
// - province: 'string'
// - financing: [{...datos de la simulacion}]

export default function ClientDetailView({ client, onUpdateClient, onBack, products, onStartQualification, onUpdateQualificationStatus }) {
    const [activeTab, setActiveTab] = useState('general');
    const [isEditingClient, setIsEditingClient] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isAddingActivity, setIsAddingActivity] = useState(false);
    const [showQualificationStatusModal, setShowQualificationStatusModal] = useState(false);
    const [qualificationToUpdate, setQualificationToUpdate] = useState(null);
    const [qualificationNewStatus, setQualificationNewStatus] = useState('');

    if (!client) {
        return <div className="p-8">Cargando cliente...</div>;
    }

    const handleSaveSimulation = (simulationData) => {
        const newFinancing = {
            id: `fin-${Date.now()}`,
            ...simulationData,
            simulationDate: new Date().toISOString()
        };
        const updatedClient = {
            ...client,
            financing: [...(client.financing || []), newFinancing],
            lastUpdate: new Date().toISOString()
        };
        onUpdateClient(updatedClient);
        setIsSimulating(false);
    };
    
    const handleSaveActivity = (activity) => {
        const newActivity = activity.id ? activity : { ...activity, id: `act-${Date.now()}` };
        const updatedActivities = client.activities ? 
            (client.activities.find(a => a.id === newActivity.id) ? 
                client.activities.map(a => a.id === newActivity.id ? newActivity : a) :
                [...client.activities, newActivity])
            : [newActivity];

        const updatedClient = {
            ...client,
            activities: updatedActivities,
            lastUpdate: new Date().toISOString()
        };
        onUpdateClient(updatedClient);
        setIsAddingActivity(false);
    };

    const renderGeneralTab = () => (
        <div className="space-y-4">
            <div className="flex items-center"><User className="mr-2 text-gray-500" /> <strong>Persona de Contacto:</strong> {client.contactPerson || 'No especificado'}</div>
            <div className="flex items-center"><MapPin className="mr-2 text-gray-500" /> <strong>Provincia:</strong> {client.province || 'No especificado'}</div>
            <p><strong>Industria:</strong> {client.industry}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Teléfono:</strong> {client.phone}</p>
        </div>
    );
    
    const renderFinancingTab = () => (
        <div>
            <button onClick={() => setIsSimulating(true)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center mb-6">
                <PlusCircle size={18} className="mr-2"/> Nueva Simulación
            </button>
            <div className="space-y-4">
                {(client.financing || []).length > 0 ? (client.financing || []).map(fin => (
                    <div key={fin.id} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-bold">{fin.productName}</p>
                        <p>Monto: ${Number(fin.monto).toLocaleString('es-AR')} {fin.moneda}</p>
                        <p>Plazo: {fin.plazo} meses | Tasa: {fin.tasa}% {fin.tasaTipo}</p>
                        <p className="text-xs text-gray-500">Simulado el: {new Date(fin.simulationDate).toLocaleDateString('es-AR')}</p>
                    </div>
                )) : <p>No hay financiaciones registradas.</p>}
            </div>
        </div>
    );

    const renderActivitiesTab = () => (
         <div>
            <button onClick={() => setIsAddingActivity(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center mb-6">
                <PlusCircle size={18} className="mr-2"/> Nueva Actividad
            </button>
            <div className="space-y-4">
                {(client.activities || []).map(act => (
                    <div key={act.id} className="p-4 bg-gray-50 rounded-lg">
                        <p className={`font-bold ${act.completed ? 'line-through' : ''}`}>{act.title}</p>
                        <p>Tipo: {act.type}</p>
                        <p>Fecha: {new Date(act.date).toLocaleString('es-AR')}</p>
                        <p className="text-sm mt-1">{act.note}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderHistoryTab = () => (
        <div className="space-y-4">
            {(client.history || []).map((entry, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold">{entry.type}</p>
                    <p className="text-sm">{entry.reason}</p>
                    <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleString('es-AR')}</p>
                </div>
            ))}
        </div>
    );
    
    // Nuevo tab para la calificación
    const renderQualificationsTab = () => (
        <div className="space-y-4">
            {(client.qualifications || []).length > 0 ? (
                client.qualifications.map(qualification => (
                    <div key={qualification.id} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800">{qualification.sgrName}</h4>
                        <p className="text-sm text-gray-600">Estado: {qualification.status}</p>
                        <p className="text-xs text-gray-500 mt-1">Enviado: {new Date(qualification.submissionDate).toLocaleDateString()}</p>
                        
                        {/* Dropdown para cambiar el estado individual */}
                        <div className="mt-2">
                            <label className="text-xs text-gray-500">Actualizar estado:</label>
                            <select 
                                value={qualification.status} 
                                onChange={(e) => {
                                    setQualificationToUpdate(qualification);
                                    setQualificationNewStatus(e.target.value);
                                    setShowQualificationStatusModal(true);
                                }}
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm"
                            >
                                <option value={qualification.status}>{qualification.status}</option>
                                <option value="Calificado (Ganado)">Calificado (Ganado)</option>
                                <option value="No Calificado (Perdido)">No Calificado (Perdido)</option>
                            </select>
                        </div>
                        {qualification.status === 'Calificado (Ganado)' && (
                            <div className="mt-2 text-sm text-blue-700">
                                <p>Monto: ${qualification.lineAmount.toLocaleString('es-AR')}</p>
                                <p>Vencimiento: {new Date(qualification.lineExpiryDate).toLocaleDateString('es-AR')}</p>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No hay calificaciones registradas.</p>
            )}
        </div>
    );

    const handleSaveQualificationStatus = (details) => {
        onUpdateQualificationStatus(client.id, qualificationToUpdate.id, qualificationNewStatus, details);
        setShowQualificationStatusModal(false);
        setQualificationToUpdate(null);
    };

    return (
        <div className="p-8">
            <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Volver a la lista</button>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{client.name}</h1>
                    <p className="text-lg text-gray-600">{client.status}</p>
                </div>
                <div className="flex items-center space-x-2">
                    {client.status === 'Prospecto' && (
                        <button
                            onClick={onStartQualification}
                            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center"
                        >
                            <DollarSign size={18} className="mr-2"/> Enviar a Calificar
                        </button>
                    )}
                    <button onClick={() => setIsEditingClient(true)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 flex items-center">
                        <Edit size={18} className="mr-2"/> Editar Cliente
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button onClick={() => setActiveTab('general')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>General</button>
                        <button onClick={() => setActiveTab('financing')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'financing' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Financiación</button>
                        <button onClick={() => setActiveTab('activities')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'activities' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Actividades</button>
                        <button onClick={() => setActiveTab('qualifications')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'qualifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Calificaciones</button>
                        <button onClick={() => setActiveTab('history')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Historial</button>
                    </nav>
                </div>
                <div>
                    {activeTab === 'general' && renderGeneralTab()}
                    {activeTab === 'financing' && renderFinancingTab()}
                    {activeTab === 'activities' && renderActivitiesTab()}
                    {activeTab === 'qualifications' && renderQualificationsTab()}
                    {activeTab === 'history' && renderHistoryTab()}
                </div>
            </div>
            {isEditingClient && <ClientModal clientToEdit={client} onClose={() => setIsEditingClient(false)} onSave={onUpdateClient} />}
            {isSimulating && <SimulationModal products={products} onClose={() => setIsSimulating(false)} onSave={handleSaveSimulation} />}
            {isAddingActivity && <ActivityModal client={client} onClose={() => setIsAddingActivity(false)} onSave={handleSaveActivity} />}
            {showQualificationStatusModal && qualificationToUpdate && (
                <QualificationStatusModal
                    client={client}
                    qualification={qualificationToUpdate}
                    newStatus={qualificationNewStatus}
                    onClose={() => setShowQualificationStatusModal(false)}
                    onSave={handleSaveQualificationStatus}
                />
            )}
        </div>
    );
}