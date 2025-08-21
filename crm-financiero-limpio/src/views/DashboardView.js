// DashboardView.js
import React, { useState, useMemo } from 'react';
import { Calendar, CheckSquare, AlertCircle, Edit, PlusCircle, Trash2 } from 'lucide-react';
import { FUNNEL_STAGES } from '../data';
import EventDetailModal from '../components/modals/EventDetailModal';
import ActivityModal from '../components/modals/ActivityModal';
import FunnelStageDetailModal from '../components/modals/FunnelStageDetailModal';

export default function DashboardView({ clients, onUpdateClient, tasks, onUpdateTask, onDeleteTask, setView, onNewClient, onNavigateToClient }) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingActivity, setEditingActivity] = useState(null);
    const [viewingStage, setViewingStage] = useState(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 15);

    const handleToggleTask = (taskId) => {
        const taskToUpdate = tasks.find(t => t.id === taskId);
        if (taskToUpdate) {
            onUpdateTask({ ...taskToUpdate, isCompleted: !taskToUpdate.isCompleted });
        }
    };
    
    const handleSaveTask = (taskData) => {
        onUpdateTask(taskData);
        setEditingActivity(null);
    };

    const overdueTasks = useMemo(() => 
        tasks.filter(task => new Date(task.date) < today && !task.isCompleted)
             .sort((a, b) => new Date(a.date) - new Date(b.date)), 
    [tasks, today]);
        
    const eventsToday = useMemo(() => 
        tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= today && taskDate < tomorrow && !task.isCompleted;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [tasks, today, tomorrow]);
        
    const upcomingEvents = useMemo(() => 
        tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= tomorrow && taskDate < twoWeeksFromNow && !task.isCompleted;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [tasks, tomorrow, twoWeeksFromNow]);
    
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
    
    // Esta función ya no es necesaria, ya que las tareas se gestionan globalmente.
    // const handleToggleActivity = (clientId, activityId) => {
    //    ...
    // };

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
                                            <p className="text-sm text-gray-500 hover:underline cursor-pointer" onClick={() => onNavigateToClient(task.client)}>{task.clientName}</p>
                                            <p className="text-sm text-gray-500">Venció el {new Date(task.date).toLocaleDateString('es-AR', {timeZone: 'UTC'})}</p>
                                        </div>
                                        <button onClick={() => setEditingActivity(task)} title="Reprogramar" className="p-1 text-gray-500 hover:text-blue-600 ml-2"><Edit size={18}/></button>
                                        <button onClick={() => handleToggleTask(task.id)} title="Completar" className="p-1 text-gray-500 hover:text-green-600"><CheckSquare size={18}/></button>
                                        <button onClick={() => onDeleteTask(task.id)} title="Eliminar" className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={18}/></button>
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
                                            <p className="text-sm text-gray-500 hover:underline cursor-pointer" onClick={() => onNavigateToClient(event.client)}>{event.clientName} - {new Date(event.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setEditingActivity(event)} title="Editar" className="p-1 text-gray-500 hover:text-blue-600 ml-2"><Edit size={18}/></button>
                                    <button onClick={() => handleToggleTask(event.id)} title="Completar" className="p-1 text-gray-500 hover:text-green-600"><CheckSquare size={18}/></button>
                                    <button onClick={() => onDeleteTask(event.id)} title="Eliminar" className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={18}/></button>
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
                                            <p className="text-sm text-gray-500 hover:underline cursor-pointer" onClick={() => onNavigateToClient(event.client)}>{event.clientName} - {new Date(event.date).toLocaleDateString('es-AR', {timeZone: 'UTC'})}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setEditingActivity(event)} title="Editar" className="p-1 text-gray-500 hover:text-blue-600 ml-2"><Edit size={18}/></button>
                                    <button onClick={() => handleToggleTask(event.id)} title="Completar" className="p-1 text-gray-500 hover:text-green-600"><CheckSquare size={18}/></button>
                                    <button onClick={() => onDeleteTask(event.id)} title="Eliminar" className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={18}/></button>
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
            {editingActivity && <ActivityModal activityToEdit={editingActivity} onClose={() => setEditingActivity(null)} onSave={handleSaveTask} />}
            {viewingStage && <FunnelStageDetailModal stageName={viewingStage} clients={clients.filter(c => c.status === viewingStage)} onClose={() => setViewingStage(null)} onClientSelect={handleClientSelectFromFunnel} />}
        </div>
    );
}