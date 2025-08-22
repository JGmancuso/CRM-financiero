import React, { useState, useMemo } from 'react';
import { Calendar, CheckSquare, AlertCircle, Edit, PlusCircle, Trash2, Info } from 'lucide-react';
import { FUNNEL_STAGES } from '../data';
import { useAgenda } from '../hooks/useAgenda';
import EventDetailModal from '../components/modals/EventDetailModal';
import ActivityModal from '../components/modals/ActivityModal';
import FunnelStageDetailModal from '../components/modals/FunnelStageDetailModal';

// 👇 1. Actualizamos las props para recibir 'tasks'
export default function DashboardView({ clients, negocios, tasks, onUpdateTask, onDeleteTask, onNewClient, onNavigateToClient }) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingActivity, setEditingActivity] = useState(null);
    const [viewingStage, setViewingStage] = useState(null);

    // 👇 2. Usamos el hook con la lista correcta de 'tasks' en lugar de 'clients'
    const { overdueTasks, eventsToday, upcomingEvents } = useAgenda(tasks);
    
    const funnelStats = useMemo(() => {
        const counts = {};
        for (const key in FUNNEL_STAGES) {
            counts[FUNNEL_STAGES[key]] = 0;
        }
        (negocios || []).forEach(negocio => {
            const stageName = FUNNEL_STAGES[negocio.estado];
            if (stageName) {
                counts[stageName]++;
            }
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count }));
    }, [negocios]);
    
    const handleToggleTask = (task) => {
        if(onUpdateTask) {
            onUpdateTask({ ...task, isCompleted: !task.isCompleted });
        }
    };
    
    const handleSaveTask = (taskData) => {
        if(onUpdateTask) {
            onUpdateTask(taskData);
        }
        setEditingActivity(null);
    };

    const handleClientSelectFromFunnel = (client) => {
        onNavigateToClient(client);
        setViewingStage(null);
    };
    
    return (
        <div className="p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                 <h1 className="text-3xl font-bold text-gray-800">Panel de Inicio</h1>
                 <button onClick={onNewClient} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
                    <PlusCircle size={18} className="mr-2"/> Nuevo Cliente
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna de Agenda */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg space-y-6">
                    {overdueTasks.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center"><AlertCircle className="mr-2"/> Tareas Vencidas</h2>
                            <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
                                {overdueTasks.map(task => (
                                    <div key={task.id} className="p-3 bg-red-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="flex-grow">
                                                <p className="font-semibold">{task.title}</p>
                                                <p className="text-sm text-gray-500">{task.clientName}</p>
                                                <p className="text-sm text-gray-500">Venció el {new Date(task.dueDate).toLocaleDateString('es-AR', {timeZone: 'UTC'})}</p>
                                            </div>
                                            <button onClick={() => handleToggleTask(task)} title="Completar" className="p-1 text-gray-500 hover:text-green-600"><CheckSquare size={18}/></button>
                                        </div>
                                        {/* 👇 3. Mostramos los detalles de la tarea del embudo */}
                                        {task.details && (
                                            <div className="mt-2 text-xs text-gray-700 bg-red-100 p-2 rounded-md border-l-2 border-red-300">
                                                <span className="font-semibold">Detalle:</span>
                                                <p className="italic">"{task.details}"</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Tareas de Hoy</h2>
                        <div className="space-y-4">
                            {eventsToday.length > 0 ? eventsToday.map(event => (
                                <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="flex-grow">
                                            <p className="font-semibold">{event.title}</p>
                                            <p className="text-sm text-gray-500">{event.clientName}</p>
                                        </div>
                                        <button onClick={() => handleToggleTask(event)} title="Completar" className="p-1 text-gray-500 hover:text-green-600"><CheckSquare size={18}/></button>
                                    </div>
                                    {/* 👇 3. Y aquí también mostramos los detalles */}
                                    {event.details && (
                                        <div className="mt-2 text-xs text-gray-700 bg-gray-100 p-2 rounded-md border-l-2 border-gray-300">
                                            <span className="font-semibold">Detalle:</span>
                                            <p className="italic">"{event.details}"</p>
                                        </div>
                                    )}
                                </div>
                            )) : <p className="text-gray-500">No hay tareas para hoy.</p>}
                        </div>
                    </div>
                    {/* ...el resto del componente no necesita cambios... */}
                </div>

                {/* Columna del Embudo */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Embudo de Negocios</h2>
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

            {/* Modales */}
            {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
            {editingActivity && <ActivityModal activityToEdit={editingActivity} onClose={() => setEditingActivity(null)} onSave={handleSaveTask} clients={clients} />}
            {viewingStage && <FunnelStageDetailModal stageName={viewingStage} negocios={negocios.filter(n => FUNNEL_STAGES[n.estado] === viewingStage)} onClose={() => setViewingStage(null)} onClientSelect={handleClientSelectFromFunnel} />}
        </div>
    );
}