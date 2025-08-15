import React from 'react';
import { PlusCircle, Calendar, CheckSquare, Edit } from 'lucide-react';

export default function ActivitiesTab({ client, onAddActivity, onToggleActivity }) {
    const activities = client.activities || [];
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Tareas y Eventos</h3>
                <button onClick={() => onAddActivity()} className="bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition text-sm flex items-center"><PlusCircle size={16} className="mr-2" /> Nueva Actividad</button>
            </div>
            <div className="space-y-3">
                {activities.length > 0 ? activities.map(a => (
                    <div key={a.id} className={`p-3 rounded-lg flex items-center ${a.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                        {a.type === 'event' ? <Calendar className="text-purple-500 mr-3 flex-shrink-0" /> : <CheckSquare className="text-green-500 mr-3 flex-shrink-0" />}
                        <div className="flex-grow">
                            <p className={`font-semibold text-gray-800 ${a.completed ? 'line-through text-gray-500' : ''}`}>{a.title}</p>
                            <p className={`text-sm text-gray-500 ${a.completed ? 'line-through' : ''}`}>{new Date(a.date).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                            <button onClick={() => onToggleActivity(a.id)} title={a.completed ? "Marcar como pendiente" : "Completar"} className="p-1 text-gray-500 hover:text-green-600">
                                <CheckSquare size={18} />
                            </button>
                            <button onClick={() => onAddActivity(a)} title="Editar" className="p-1 text-gray-500 hover:text-blue-600">
                                <Edit size={18} />
                            </button>
                        </div>
                    </div>
                )) : (<div className="text-center text-gray-400 py-6">No hay actividades registradas.</div>)}
            </div>
        </div>
    );
}