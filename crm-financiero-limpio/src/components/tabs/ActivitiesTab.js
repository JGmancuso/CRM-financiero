import React, { useState } from 'react';
import { PlusCircle, Edit } from 'lucide-react';
import ActivityModal from '../modals/ActivityModal';

export default function ActivitiesTab({ client, onSaveActivity, onToggleActivity }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);

    const handleOpenModal = (activity = null) => {
        setEditingActivity(activity);
        setIsModalOpen(true);
    };

    const handleSave = (activityData) => {
        // Llama a la función de App.js con el ID del cliente y los datos
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