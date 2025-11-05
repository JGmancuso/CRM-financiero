import React, { useState } from 'react';
import { CheckSquare, Square, Calendar, Trash2, AlertTriangle, Edit, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import ActivityModal from '../modals/ActivityModal';

export default function ActivitiesTab({ client }) {
    const { dispatch } = useData();
    const [editingActivity, setEditingActivity] = useState(null);

    const activities = client.activities || [];

    const isValidDate = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    const sortedActivities = [...activities].sort((a, b) => {
        if (!isValidDate(a.dueDate) && isValidDate(b.dueDate)) return 1;
        if (isValidDate(a.dueDate) && !isValidDate(b.dueDate)) return -1;
        if (a.completed === b.completed) {
            if (isValidDate(a.dueDate) && isValidDate(b.dueDate)) {
                 return new Date(b.dueDate) - new Date(a.dueDate);
            }
            return 0;
        }
        return a.completed ? 1 : -1;
    });

    // 👇 FUNCIÓN ACTUALIZADA: AHORA ES IDEMPOTENTE 👇
    const handleToggle = (e, activity) => {
        e.stopPropagation(); // Mantenemos esto por buena práctica

        // Calculamos el nuevo estado deseado (lo contrario del actual)
        const newStatus = !activity.completed;

        console.log(`🛡️ Enviando orden de establecer estado a: ${newStatus}`);

        dispatch({ 
            type: 'TOGGLE_ACTIVITY', 
            payload: { 
                clientId: client.id, 
                activityId: activity.id,
                targetStatus: newStatus // <--- Enviamos el objetivo exacto
            } 
        });
    };

    const handleDelete = (activityId) => {
        if (window.confirm('¿Eliminar esta actividad?')) {
            dispatch({ type: 'DELETE_ACTIVITY', payload: { clientId: client.id, activityId } });
        }
    };

    const handleRepairDate = (activity) => {
        const today = new Date().toISOString().split('T')[0];
        const repairedActivity = { ...activity, dueDate: today };
        dispatch({ type: 'UPDATE_ACTIVITY', payload: { clientId: client.id, activityData: repairedActivity } });
    };

    const handleRecreate = (activity) => {
        if (window.confirm("¿Re-crear esta actividad para corregir posibles errores internos?")) {
            const freshActivityData = {
                description: activity.description,
                details: activity.details || '',
                dueDate: isValidDate(activity.dueDate) ? activity.dueDate : new Date().toISOString().split('T')[0],
                completed: false
            };
            dispatch({ type: 'DELETE_ACTIVITY', payload: { clientId: client.id, activityId: activity.id } });
            dispatch({ type: 'SAVE_ACTIVITY', payload: { clientId: client.id, activityData: freshActivityData } });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Tareas y Eventos</h3>
            </div>

            {sortedActivities.length === 0 ? (
                <p className="text-gray-500 italic">No hay actividades registradas para este cliente.</p>
            ) : (
                <div className="space-y-2">
                    {sortedActivities.map(act => {
                        const isDateOk = isValidDate(act.dueDate);
                        return (
                            <div key={act.id} className={`p-3 rounded-lg border flex items-center justify-between ${act.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'}`}>
                                <div className="flex items-center overflow-hidden">
                                    {/* 👇 Pasamos el evento 'e' aquí 👇 */}
                                    <button onClick={(e) => handleToggle(e, act.id)} className="mr-3 flex-shrink-0 text-gray-400 hover:text-blue-600">
                                        {act.completed ? <CheckSquare className="text-green-500" /> : <Square />}
                                    </button>
                                    <div className="truncate">
                                        <p className={`font-medium ${act.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                            {act.description || 'Sin descripción'}
                                        </p>
                                        <div className="text-xs text-gray-500 flex items-center mt-1">
                                            <Calendar size={12} className="mr-1" />
                                            {isDateOk ? (
                                                new Date(act.dueDate).toLocaleDateString('es-AR', { timeZone: 'UTC' })
                                            ) : (
                                                <button onClick={() => handleRepairDate(act)} className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold flex items-center hover:bg-red-200 transition-colors animate-pulse">
                                                    <AlertTriangle size={12} className="mr-1" /> REPARAR FECHA
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-shrink-0 ml-2 items-center">
                                    <button onClick={() => handleRecreate(act)} className="p-1 text-gray-400 hover:text-green-600 mx-1" title="Re-crear actividad"><RefreshCw size={16} /></button>
                                    <button onClick={() => setEditingActivity(act)} className="p-1 text-gray-400 hover:text-blue-600 mx-1"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(act.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {editingActivity && (
                <ActivityModal 
                    activityToEdit={editingActivity} 
                    onClose={() => setEditingActivity(null)}
                    onSave={(updatedAct) => {
                         dispatch({ type: 'UPDATE_ACTIVITY', payload: { clientId: client.id, activityData: updatedAct } });
                         setEditingActivity(null);
                    }}
                />
            )}
        </div>
    );
}