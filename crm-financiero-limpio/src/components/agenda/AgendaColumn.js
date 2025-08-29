import React from 'react';
import TaskItem from '../common/TaskItem';
//nose//
// 👇 1. Añadimos 'onDelete' a la lista de props que recibe el componente.
export default function AgendaColumn({ title, tasks, onToggleComplete, onEdit, onView, onDelete }) {
    return (
        <div className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0">
            <h2 className="font-bold text-lg mb-4 text-gray-700">{title} ({tasks.length})</h2>
            <div className="space-y-3 overflow-y-auto h-[60vh] p-1">
                {tasks.length > 0 ? (
                    tasks.map(task => 
                        <TaskItem 
                            key={`${task.source}-${task.id}`} 
                            task={task} 
                            onToggleComplete={onToggleComplete}
                            onEdit={onEdit}
                            onView={onView}
                            onDelete={onDelete} // <-- 2. Pasamos la función hacia el componente TaskItem.
                        />)
                ) : (
                    <p className="text-center text-gray-500 pt-10">Nada por aquí.</p>
                )}
            </div>
        </div>
    );
}