import React from 'react';
import { CheckSquare, Edit, Square } from 'lucide-react';

export default function TaskItem({ task, onToggleComplete, onEdit, onView }) {
    const handleToggle = (e) => {
        e.stopPropagation();
        onToggleComplete(task);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(task);
    };

    // --- 👇 LÓGICA DE COLOR DE FONDO POR ORIGEN AÑADIDA AQUÍ 👇 ---
    const getBackgroundColor = (source) => {
        switch (source) {
            case 'clientes':
                return 'bg-blue-50'; // Azul muy claro para clientes
            case 'gestiones':
                return 'bg-green-50'; // Verde muy claro para gestiones activas
            case 'embudo':
                return 'bg-purple-50'; // Púrpura muy claro para tareas de embudo
            default:
                return 'bg-gray-50'; // Gris muy claro por defecto
        }
    };

    const backgroundColorClass = getBackgroundColor(task.source);
    // --- 👆 FIN DE LA LÓGICA DE COLOR 👆 ---

    return (
        // 👇 Aplicamos la clase de color de fondo al div principal
        <div 
            onClick={() => onView(task)}
            className={`p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow mb-2 ${backgroundColorClass}`}
        >
            <div className="flex items-start">
                <div className="flex-grow">
                    <p className={`font-semibold ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</p>
                    <p className={`text-sm ${task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>{task.clientName || 'General'}</p>
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
                </div>
            </div>
            {task.details && !task.isCompleted && (
                <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded"> {/* Un tono un poco más oscuro para el detalle si quieres */}
                    <p className="italic">"{task.details}"</p>
                </div>
            )}
        </div>
    );
}