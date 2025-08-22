// AgendaView.js
import React, { useState } from 'react';
import { Calendar, CheckSquare, Edit, Trash2, Info } from 'lucide-react';
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
    
    const handleToggleTask = (taskToToggle) => {
        if (taskToToggle) {
            onUpdateTask({ ...taskToToggle, isCompleted: !taskToToggle.isCompleted });
        }
    };
    
    // Usamos 'dueDate' como la fecha principal para ordenar
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return (
        <div className="p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Agenda de Tareas y Eventos</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="space-y-4">
                    {sortedTasks.map(task => (
                        <div key={task.id} className={`p-4 rounded-lg transition-colors ${task.isCompleted ? 'bg-green-50' : 'bg-gray-50'}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-grow">
                                    <p className={`font-semibold ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.title}</p>
                                    <p className={`text-sm ${task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {task.clientName} - Vence: {new Date(task.dueDate).toLocaleDateString('es-AR', {timeZone: 'UTC'})}
                                    </p>
                                    
                                    {/* 👇 AQUÍ MOSTRAMOS LOS DETALLES DEL NEGOCIO 👇 */}
                                    {task.details && (
                                        <div className="mt-2 flex items-start text-sm text-gray-700 bg-gray-100 p-2 rounded-md border-l-4 border-gray-300">
                                            <Info size={16} className="mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                                            <div>
                                                <span className="font-semibold">Detalle del Negocio:</span>
                                                <p className="italic">"{task.details}"</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                                    <button onClick={() => handleToggleTask(task)} title={task.isCompleted ? "Marcar como pendiente" : "Completar"} className="p-1 text-gray-500 hover:text-green-600">
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
                        </div>
                    ))}
                </div>
            </div>
            {editingTask && <ActivityModal activityToEdit={editingTask} onClose={() => setEditingTask(null)} onSave={handleSaveTask} />}
        </div>
    );
}