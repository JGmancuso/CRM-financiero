import React, { useState, useMemo } from 'react';
import { Calendar, CheckSquare, Edit } from 'lucide-react';
import ActivityModal from '../components/modals/ActivityModal';

export default function AgendaView({ clients, onUpdateClient }) {
    const [editingActivity, setEditingActivity] = useState(null);

    const allActivities = useMemo(() => 
        clients.flatMap(c => (c.activities || []).map(a => ({ ...a, clientName: c.name, clientId: c.id })))
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [clients]);

    const handleSaveActivity = (activity) => {
        const client = clients.find(c => c.id === editingActivity.clientId);
        if(!client) return;

        const activities = [...(client.activities || [])];
        const index = activities.findIndex(a => a.id === activity.id);
        activities[index] = activity;
        
        onUpdateClient({ ...client, activities, lastUpdate: new Date().toISOString() });
        setEditingActivity(null);
    };
    
    const handleToggleActivity = (clientId, activityId) => {
        const client = clients.find(c => c.id === clientId);
        if (!client) return;
        const updatedActivities = (client.activities || []).map(a => 
            a.id === activityId ? { ...a, completed: !a.completed } : a
        );
        onUpdateClient({ ...client, activities: updatedActivities, lastUpdate: new Date().toISOString() });
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Agenda de Tareas y Eventos</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="space-y-4">
                    {allActivities.map(activity => (
                        <div key={activity.id} className={`p-4 rounded-lg flex items-center ${activity.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                            <div className="flex-shrink-0 mr-4">
                                {activity.type === 'event' ? <Calendar className="text-purple-500" /> : <CheckSquare className="text-green-500" />}
                            </div>
                            <div className="flex-grow">
                                <p className={`font-semibold ${activity.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{activity.title}</p>
                                <p className={`text-sm ${activity.completed ? 'line-through text-gray-400' : 'text-gray-500'}`}>
                                    {activity.clientName} - {new Date(activity.date).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                                <button onClick={() => handleToggleActivity(activity.clientId, activity.id)} title={activity.completed ? "Marcar como pendiente" : "Completar"} className="p-1 text-gray-500 hover:text-green-600">
                                    <CheckSquare size={18} />
                                </button>
                                <button onClick={() => setEditingActivity(activity)} title="Editar" className="p-1 text-gray-500 hover:text-blue-600">
                                    <Edit size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {editingActivity && <ActivityModal activityToEdit={editingActivity} onClose={() => setEditingActivity(null)} onSave={handleSaveActivity} />}
        </div>
    );
}