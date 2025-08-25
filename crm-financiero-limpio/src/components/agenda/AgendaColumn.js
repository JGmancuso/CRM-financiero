import React from 'react';
import TaskItem from '../common/TaskItem';

// 1. Asegúrate de que reciba 'onToggleComplete'
export default function AgendaColumn({ title, tasks, onToggleComplete, onEdit, onView }) {
    return (
        <div className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0">
            <h2 className="font-bold text-lg mb-4 text-gray-700">{title} ({tasks.length})</h2>
            <div className="space-y-3 overflow-y-auto h-[60vh] p-1">
                {tasks.length > 0 ? (
                    tasks.map(task => 
                        <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggleComplete={onToggleComplete} // <-- 2. Pasa la función al TaskItem
                            onEdit={onEdit}
                            onView={onView}
                        />)
                ) : (
                    <p className="text-center text-gray-500 pt-10">Nada por aquí.</p>
                )}
            </div>
        </div>
    );
}
