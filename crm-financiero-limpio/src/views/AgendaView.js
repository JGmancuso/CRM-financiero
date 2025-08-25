import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import AgendaColumn from '../components/agenda/AgendaColumn';
import { useAgenda } from '../hooks/useAgenda';
import ActivityModal from '../components/modals/ActivityModal';
import TaskDetailModal from '../components/modals/TaskDetailModal';

export default function AgendaView({ clients, tasks, onUpdateTask, onAddTask, onToggleTaskCompletion }) {
    const [filter, setFilter] = useState('todos');
    const { overdueTasks, tasksByDayOfWeek, futureTasks } = useAgenda(clients, tasks, filter);
    
    const [editingTask, setEditingTask] = useState(null);
    const [viewingTask, setViewingTask] = useState(null);

    const handleSaveTask = (taskData) => {
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
    
    const filters = [
        { id: 'todos', name: 'Todos' }, { id: 'embudo', name: 'Embudo' },
        { id: 'clientes', name: 'Clientes' }, { id: 'gestiones', name: 'Gestiones Activas' },
    ];
    
    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-800">Planificador Semanal</h1>
                <button onClick={() => setEditingTask({})} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center">
                    <PlusCircle size={18} className="mr-2"/> Nueva Tarea
                </button>
            </div>
            
            <div className="flex space-x-2 mb-8">
                {filters.map(f => (
                    <button key={f.id} onClick={() => setFilter(f.id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition ${filter === f.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                        {f.name}
                    </button>
                ))}
            </div>
            
            <div className="flex space-x-4 overflow-x-auto flex-grow pb-4">
                <AgendaColumn title="Vencidas" tasks={overdueTasks} onToggleComplete={onToggleTaskCompletion} onEdit={setEditingTask} onView={setViewingTask} />
                {weekDays.map(day => (
                    <AgendaColumn key={day.id} title={day.name} tasks={tasksByDayOfWeek[day.id] || []} onToggleComplete={onToggleTaskCompletion} onEdit={setEditingTask} onView={setViewingTask} />
                ))}
                <AgendaColumn title="Próximas" tasks={futureTasks} onToggleComplete={onToggleTaskCompletion} onEdit={setEditingTask} onView={setViewingTask} />
            </div>

            {editingTask && (<ActivityModal activityToEdit={editingTask.id ? editingTask : null} onClose={() => setEditingTask(null)} onSave={handleSaveTask} />)}
            {viewingTask && (<TaskDetailModal task={viewingTask} onClose={() => setViewingTask(null)} />)}
        </div>
    );
}