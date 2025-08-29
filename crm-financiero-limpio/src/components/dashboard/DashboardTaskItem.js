import React from 'react';
import { Check, Edit, Square } from 'lucide-react';

export default function DashboardTaskItem({ task, onToggleComplete, onEdit }) {
    // --- Lógica de Fechas Mejorada ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Creamos la fecha de la tarea en el mismo formato para una comparación precisa
    const taskDueDate = new Date(task.dueDate + 'T00:00:00');

    const isOverdue = !task.isCompleted && taskDueDate < today;
    const isDueToday = !task.isCompleted && taskDueDate.getTime() === today.getTime();
    // --- Fin de la Lógica de Fechas ---

    // Función para determinar el color del recuadro
    const getCheckboxColor = () => {
        if (isOverdue) return 'text-red-500'; // Rojo para vencidas
        if (isDueToday) return 'text-green-500'; // Verde para hoy
        return 'text-gray-400'; // Gris para futuras
    };

    return (
        <div className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm hover:bg-gray-50">
            <div className="flex items-center flex-grow min-w-0">
                <button onClick={() => onToggleComplete(task)} className="mr-3 flex-shrink-0">
                    {task.isCompleted 
                        ? <Check className="text-green-500" /> 
                        : <Square className={getCheckboxColor()} />
                    }
                </button>
                <div className="truncate">
                    <p className={`text-sm font-medium truncate ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{task.clientName}</p>
                </div>
            </div>
            <button onClick={() => onEdit(task)} className="ml-2 p-1 text-gray-400 hover:text-blue-600 flex-shrink-0">
                <Edit size={14} />
            </button>
        </div>
    );
}