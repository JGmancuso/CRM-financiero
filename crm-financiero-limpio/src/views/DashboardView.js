import React, { useState, useMemo } from 'react';
import { Calendar, CheckSquare, AlertCircle, Edit, PlusCircle } from 'lucide-react';
import { FUNNEL_STAGES } from '../data';
import EventDetailModal from '../components/modals/EventDetailModal';
import ActivityModal from '../components/modals/ActivityModal';
import FunnelStageDetailModal from '../components/modals/FunnelStageDetailModal';

export default function DashboardView({ clients, onUpdateClient, setView, onNewClient, onNavigateToClient }) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingActivity, setEditingActivity] = useState(null);
    const [viewingStage, setViewingStage] = useState(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 15);

    const handleToggleActivity = (clientId, activityId) => {
        const client = clients.find(c => c.id === clientId);
        if (!client) return;
        const updatedActivities = (client.activities || []).map(a => 
            a.id === activityId ? { ...a, completed: !a.completed } : a
        );
        onUpdateClient({ ...client, activities: updatedActivities, lastUpdate: new Date().toISOString() });
    };

    const handleSaveActivity = (activity) => {
        const client = clients.find(c => c.id === editingActivity.clientId);
        if(!client) return;

        const activities = [...(client.activities || [])];
        const index = activities.findIndex(a => a.id === activity.id);
        activities[index] = activity;
        
        onUpdateClient({ ...client, activities, lastUpdate: new Date().toISOString() });
        setEditingActivity(null);
    };

    const allActivities = useMemo(() => 
        clients.flatMap(c => (c.activities || []).map(a => ({ ...a, clientName: c.name, clientId: c.id, client: c }))),
    [clients]);

    const eventsToday = allActivities
        .filter(a => {
            const activityDate = new Date(a.date);
            return activityDate >= today && activityDate < tomorrow && !a.completed;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
        
    const upcomingEvents = allActivities
        .filter(a => {
            const activityDate = new Date(a.date);
            return activityDate >= tomorrow && activityDate < twoWeeksFromNow && !a.completed;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const overdueTasks = allActivities
        .filter(a => new Date(a.date) < today && !a.completed)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const funnelStats = useMemo(() => {
        return Object.values(FUNNEL_STAGES).map(stage => ({
            name: stage,
            count: clients.filter(c => c.status === stage).length
        }));
    }, [clients]);
    
    const handleClientSelectFromFunnel = (client) => {
        onNavigateToClient(client);
        setViewingStage(null);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                 <h1 className="text-3xl font-bold text-gray-800">Panel de Inicio</h1>
                 <button onClick={onNewClient} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
                    <PlusCircle size={18} className="mr-2"/> Nuevo Cliente
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg space-y-6">
                    {overdueTasks.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center"><AlertCircle className="mr-2"/> Tareas Vencidas</h2>
                            <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
                                {overdueTasks.map(task => (
                                    <div key={task.id} className="flex items-center p-3 bg-red-50 rounded-lg">
                                        <div className="flex-grow">
                                            <p className="font-semibold">{task.title}</p>
                                            {/* NAVEGACIÓN: Al hacer clic en el nombre del cliente, se navega a su detalle */}
                                            <p className="text-sm text-gray-500 hover:underline cursor-pointer" onClick={() => onNavigateToClient(task.client)}>{task.clientName}</p>
                                            <p className="text-sm text-gray-500">Venció el {new Date(task.date).toLocaleDateString('es-AR', {timeZone: 'UTC'})}</p>
                                        </div>
                                        <button onClick={() => setEditingActivity(task)} title="Reprogramar" className="p-1 text-gray-500 hover:text-blue-600 ml-2"><Edit size={18}/></button>
                                        <button onClick={() => handleToggleActivity(task.clientId, task.id)} title="Completar" className="p-1 text-gray-500 hover:text-green-600"><CheckSquare size={18}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Eventos del Día</h2>
                        <div className="space-y-4">
                            {eventsToday.length > 0 ? eventsToday.map(event => (
                                <div key={event.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <div onClick={() => setSelectedEvent(event)} className="cursor-pointer flex-grow flex items-center">
                                        {event.type === 'event' ? <Calendar className="text-purple-500 mr-4 flex-shrink-0" /> : <CheckSquare className="text-green-500 mr-4 flex-shrink-0" />}
                                        <div>
                                            <p className="font-semibold">{event.title}</p>
                                            {/* NAVEGACIÓN: Al hacer clic en el nombre del cliente, se navega a su detalle */}
                                            <p className="text-sm text-gray-500 hover:underline cursor-pointer" onClick={() => onNavigateToClient(event.client)}>{event.clientName} - {new Date(event.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setEditingActivity(event)} title="Editar" className="p-1 text-gray-500 hover:text-blue-600 ml-2"><Edit size={18}/></button>
                                    <button onClick={() => handleToggleActivity(event.clientId, event.id)} title="Completar" className="p-1 text-gray-500 hover:text-green-600"><CheckSquare size={18}/></button>
                                </div>
                            )) : <p className="text-gray-500">No hay eventos para hoy.</p>}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Próximos Eventos (14 días)</h2>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                                <div key={event.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <div onClick={() => setSelectedEvent(event)} className="cursor-pointer flex-grow flex items-center">
                                        {event.type === 'event' ? <Calendar className="text-purple-500 mr-4 flex-shrink-0" /> : <CheckSquare className="text-green-500 mr-4 flex-shrink-0" />}
                                        <div>
                                            <p className="font-semibold">{event.title}</p>
                                            {/* NAVEGACIÓN: Al hacer clic en el nombre del cliente, se navega a su detalle */}
                                            <p className="text-sm text-gray-500 hover:underline cursor-pointer" onClick={() => onNavigateToClient(event.client)}>{event.clientName} - {new Date(event.date).toLocaleDateString('es-AR', {timeZone: 'UTC'})}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setEditingActivity(event)} title="Editar" className="p-1 text-gray-500 hover:text-blue-600 ml-2"><Edit size={18}/></button>
                                    <button onClick={() => handleToggleActivity(event.clientId, event.id)} title="Completar" className="p-1 text-gray-500 hover:text-green-600"><CheckSquare size={18}/></button>
                                </div>
                            )) : <p className="text-gray-500">No hay eventos próximos.</p>}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Embudo de Clientes</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {funnelStats.map(stage => (
                            <button key={stage.name} onClick={() => setViewingStage(stage.name)} className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center hover:bg-blue-100 transition">
                                <p className="text-3xl font-bold text-blue-700">{stage.count}</p>
                                <p className="text-sm font-medium text-blue-600">{stage.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
            {editingActivity && <ActivityModal activityToEdit={editingActivity} onClose={() => setEditingActivity(null)} onSave={handleSaveActivity} />}
            {viewingStage && <FunnelStageDetailModal stageName={viewingStage} clients={clients.filter(c => c.status === viewingStage)} onClose={() => setViewingStage(null)} onClientSelect={handleClientSelectFromFunnel} />}
        </div>
    );
}