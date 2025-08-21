// AgendaView.js
import React, { useState } from 'react';
import { Calendar, CheckSquare, Edit, Trash2 } from 'lucide-react';
import ActivityModal from '../components/modals/ActivityModal';

export default function AgendaView({ clients, tasks, onAddTask, onUpdateTask, onDeleteTask }) {
    const [editingTask, setEditingTask] = useState(null);

    const handleSaveTask = (taskData) => {
        if (taskData.id) {
            onUpdateTask(taskData);
        } else {
            onAddTask(taskData);
        }
        setEditingTask(null);
    };
    
    const handleToggleTask = (taskId) => {
        const taskToUpdate = tasks.find(t => t.id === taskId);
        if (taskToUpdate) {
            onUpdateTask({ ...taskToUpdate, isCompleted: !taskToUpdate.isCompleted });
        }
    };
    
    // Las actividades ahora provienen del estado 'tasks' en lugar de 'clients'
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Agenda de Tareas y Eventos</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="space-y-4">
                    {sortedTasks.map(task => (
                        <div key={task.id} className={`p-4 rounded-lg flex items-center ${task.isCompleted ? 'bg-green-50' : 'bg-gray-50'}`}>
                            <div className="flex-shrink-0 mr-4">
                                {task.type === 'event' ? <Calendar className="text-purple-500" /> : <CheckSquare className="text-green-500" />}
                            </div>
                            <div className="flex-grow">
                                <p className={`font-semibold ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.title}</p>
                                <p className={`text-sm ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-500'}`}>
                                    {task.clientName} - {new Date(task.date).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                                <button onClick={() => handleToggleTask(task.id)} title={task.isCompleted ? "Marcar como pendiente" : "Completar"} className="p-1 text-gray-500 hover:text-green-600">
                                    <CheckSquare size={18} />
                                </button>
                                <button onClick={() => setEditingTask(task)} title="Editar" className="p-1 text-gray-500 hover:text-blue-600">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => onDeleteTask(task.id)} title="Eliminar" className="p-1 text-gray-500 hover:text-red-600">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {editingTask && <ActivityModal activityToEdit={editingTask} onClose={() => setEditingTask(null)} onSave={handleSaveTask} />}
        </div>
    );
}