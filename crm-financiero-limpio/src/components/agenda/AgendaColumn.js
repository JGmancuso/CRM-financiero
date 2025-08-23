import React from 'react';
import { CheckSquare } from 'lucide-react';

// Un componente genérico para renderizar una tarea en la agenda
const TaskItem = ({ task, onToggleTask }) => (
    <div className={`p-3 rounded-lg ${task.isCompleted ? 'bg-green-50' : 'bg-white shadow-sm'}`}>
        <div className="flex items-start">
            <div className="flex-grow">
                <p className={`font-semibold ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.title}</p>
                <p className={`text-sm ${task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>{task.clientName || 'General'}</p>
            </div>
            {!task.isCompleted && (
                <button onClick={() => onToggleTask(task)} title="Completar" className="flex-shrink-0 p-1 text-gray-400 hover:text-green-600">
                    <CheckSquare size={18}/>
                </button>
            )}
        </div>
        {task.details && (
            <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <p className="italic">"{task.details}"</p>
            </div>
        )}
    </div>
);

// El componente para la columna
export default function AgendaColumn({ title, tasks, onToggleTask }) {
    return (
        <div className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0">
            <h2 className="font-bold text-lg mb-4 text-gray-700">{title} ({tasks.length})</h2>
            <div className="space-y-3 overflow-y-auto h-[60vh] p-1">
                {tasks.length > 0 ? (
                    tasks.map(task => <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} />)
                ) : (
                    <p className="text-center text-gray-500 pt-10">Nada por aquí.</p>
                )}
            </div>
        </div>
    );
}