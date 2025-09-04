import React from 'react';
import { CheckSquare, Edit, Square, Trash2 } from 'lucide-react';

export default function TaskItem({ task, onToggleComplete, onEdit, onView, onDelete }) {
    const handleToggle = (e) => { e.stopPropagation(); onToggleComplete(task); };
    const handleEdit = (e) => { e.stopPropagation(); onEdit(task); };
    const handleDelete = (e) => { e.stopPropagation(); onDelete(task); };

    const getBackgroundColor = (source) => {
        switch (source) {
            case 'clientes': return 'bg-blue-50';
            case 'gestiones': return 'bg-green-50';
            case 'embudo': return 'bg-purple-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div 
            onClick={() => onView(task)}
            className={`p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow mb-2 ${getBackgroundColor(task.source)}`}
        >
            <div className="flex items-start">
                <div className="flex-grow">
                    {/* Esta es la única línea que muestra el título */}
                    <p className={`font-semibold ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title}
                    </p>
                    <p className={`text-sm ${task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                        Cliente: {task.clientName || 'General'}
                    </p>
                    <p className={`text-xs mt-1 ${task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                        Vence: {task.dueDate ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('es-AR', {timeZone: 'UTC'}) : 'Sin fecha'}
                    </p>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                    <button onClick={handleToggle} title="Completar" className="p-1 text-gray-400 hover:text-green-600">
                        {task.isCompleted ? <CheckSquare className="text-green-500" /> : <Square />}
                    </button>
                    <button onClick={handleEdit} title="Editar" className="p-1 text-gray-400 hover:text-blue-600">
                        <Edit size={16}/>
                    </button>
                    <button onClick={handleDelete} title="Eliminar" className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 size={16}/>
                    </button>
                </div>
            </div>
            {task.details && !task.isCompleted && (
                <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                    <p className="italic">"{task.details}"</p>
                </div>
            )}
        </div>
    );
}