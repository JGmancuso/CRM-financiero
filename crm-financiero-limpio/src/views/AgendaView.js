import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import AgendaColumn from '../components/agenda/AgendaColumn';
import { useAgenda } from '../hooks/useAgenda';
import ActivityModal from '../components/modals/ActivityModal';

export default function AgendaView({ clients, tasks, onUpdateTask, onAddTask }) {
    // 1. Estado para el filtro actual
    const [filter, setFilter] = useState('todos'); // 'todos', 'embudo', 'clientes', 'gestiones'
    
    // 2. Pasamos el filtro al hook
    const { overdueTasks, tasksByDayOfWeek, futureTasks } = useAgenda(clients, tasks, filter);
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggleTask = (task) => {
        console.log("Completar tarea:", task.id);
        // Lógica para marcar tarea como completada
    };

    const handleSaveTask = (taskData) => {
        onAddTask(taskData);
        setIsModalOpen(false);
    };

    const weekDays = [
        { id: 1, name: 'Lunes' }, { id: 2, name: 'Martes' }, { id: 3, name: 'Miércoles' },
        { id: 4, name: 'Jueves' }, { id: 5, name: 'Viernes' },
    ];

    const filters = [
        { id: 'todos', name: 'Todos' },
        { id: 'embudo', name: 'Embudo' },
        { id: 'clientes', name: 'Clientes' },
        { id: 'gestiones', name: 'Gestiones Activas' },
    ];
    
    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-800">Planificador Semanal</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center"
                >
                    <PlusCircle size={18} className="mr-2"/> Nueva Tarea
                </button>
            </div>
            
            {/* 3. Botones de Filtro */}
            <div className="flex space-x-2 mb-8">
                {filters.map(f => (
                    <button 
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                            filter === f.id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {f.name}
                    </button>
                ))}
            </div>
            
            <div className="flex space-x-4 overflow-x-auto flex-grow pb-4">
                <AgendaColumn title="Vencidas" tasks={overdueTasks} onToggleTask={handleToggleTask} />
                {weekDays.map(day => (
                    <AgendaColumn 
                        key={day.id} title={day.name} 
                        tasks={tasksByDayOfWeek[day.id] || []} 
                        onToggleTask={handleToggleTask} 
                    />
                ))}
                <AgendaColumn title="Próximas" tasks={futureTasks} onToggleTask={handleToggleTask} />
            </div>

            {isModalOpen && (<ActivityModal onClose={() => setIsModalOpen(false)} onSave={handleSaveTask} />)}
        </div>
    );
}