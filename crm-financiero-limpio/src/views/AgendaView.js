import React, { useState } from 'react';
import AgendaColumn from '../components/agenda/AgendaColumn';
import { useAgenda } from '../hooks/useAgenda';
import ActivityModal from '../components/modals/ActivityModal';
import TaskDetailModal from '../components/modals/TaskDetailModal';

export default function AgendaView({ clients, tasks, onUpdateTask, onAddTask, onToggleTaskCompletion }) {
    const { overdueTasks, tasksByDayOfWeek, futureTasks } = useAgenda(clients, tasks);
    const [editingTask, setEditingTask] = useState(null);
    const [viewingTask, setViewingTask] = useState(null);

    const handleSaveTask = (taskData) => {
        // Aquí se necesita una lógica más compleja para diferenciar entre onAddTask y onUpdateTask
        // Por ahora, asumimos que onAddTask puede manejarlo si no hay ID.
        if (taskData.id) {
            onUpdateTask(taskData);
        } else {
            onAddTask(taskData);
        }
        setEditingTask(null);
    };

    const weekDays = [
        { id: 1, name: 'Lunes' }, { id: 2, name: 'Martes' }, { id: 3, name: 'Miércoles' },
        { id: 4, name: 'Jueves' }, { id: 5, name: 'Viernes' },
    ];
    
    return (
        <div className="p-8 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex-shrink-0">Planificador Semanal</h1>
            <div className="flex space-x-4 overflow-x-auto flex-grow pb-4">
                <AgendaColumn title="Vencidas" tasks={overdueTasks} onToggleComplete={onToggleTaskCompletion} onEdit={setEditingTask} onView={setViewingTask} />
                {weekDays.map(day => (
                    <AgendaColumn key={day.id} title={day.name} tasks={tasksByDayOfWeek[day.id] || []} onToggleComplete={onToggleTaskCompletion} onEdit={setEditingTask} onView={setViewingTask} />
                ))}
                <AgendaColumn title="Próximas" tasks={futureTasks} onToggleComplete={onToggleTaskCompletion} onEdit={setEditingTask} onView={setViewingTask} />
            </div>
            {editingTask && (<ActivityModal activityToEdit={editingTask} onClose={() => setEditingTask(null)} onSave={handleSaveTask} />)}
            {viewingTask && (<TaskDetailModal task={viewingTask} onClose={() => setViewingTask(null)} />)}
        </div>
    );
}