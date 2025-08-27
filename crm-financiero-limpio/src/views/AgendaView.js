import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import AgendaColumn from '../components/agenda/AgendaColumn';
import { useAgenda } from '../hooks/useAgenda';
import ActivityModal from '../components/modals/ActivityModal';
import TaskDetailModal from '../components/modals/TaskDetailModal';
import NewTaskModal from '../components/modals/NewTaskModal';
import { useData } from '../context/DataContext';

export default function AgendaView() {
    const { state, dispatch } = useData();
    const [filter, setFilter] = useState('todos');
    
    // La variable correcta es 'tasksByDayOfWeek' (con 'W' mayúscula)
    const { overdueTasks, tasksByDayOfWeek, futureTasks } = useAgenda(state.clients, state.tasks, filter);
    
    const [editingTask, setEditingTask] = useState(null);
    const [viewingTask, setViewingTask] = useState(null);
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

    const handleUpdateTask = (taskData) => {
        // 1. Buscamos la tarea original en el estado para no perder datos como 'source'.
        const originalTask = state.tasks.find(t => t.id === taskData.id);

        // 2. Unimos la tarea original con los datos nuevos del formulario.
        //    Esto asegura que si 'source' no viene del formulario, se mantenga el original.
        const finalUpdatedTask = { ...originalTask, ...taskData };

        // 3. Despachamos la tarea completa y actualizada.
        dispatch({ type: 'UPDATE_TASK', payload: finalUpdatedTask });
        setEditingTask(null);
    };

    const handleAddNewTask = (taskData) => {
        dispatch({ type: 'ADD_TASK', payload: taskData });
        setIsNewTaskModalOpen(false);
    };
    
    const handleToggleComplete = (task) => {
        if (task.source === 'clientes') {
            dispatch({ type: 'TOGGLE_ACTIVITY', payload: { clientId: task.clientId, activityId: task.id } });
        } else {
            dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: task });
        }
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
                <button onClick={() => setIsNewTaskModalOpen(true)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center">
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
                <AgendaColumn title="Vencidas" tasks={overdueTasks} onToggleComplete={handleToggleComplete} onEdit={setEditingTask} onView={setViewingTask} />
                
                {/* --- SECCIÓN CORREGIDA --- */}
                {weekDays.map(day => (
                    <AgendaColumn 
                        key={day.id} 
                        title={day.name} 
                        // Usamos la variable con el nombre correcto: tasksByDayOfWeek
                        tasks={tasksByDayOfWeek[day.id] || []} 
                        onToggleComplete={handleToggleComplete} 
                        onEdit={setEditingTask} 
                        onView={setViewingTask} 
                    />
                ))}
                {/* --- FIN DE LA SECCIÓN CORREGIDA --- */}

                <AgendaColumn title="Próximas" tasks={futureTasks} onToggleComplete={handleToggleComplete} onEdit={setEditingTask} onView={setViewingTask} />
            </div>

            {editingTask && (
                <ActivityModal 
                    activityToEdit={editingTask} 
                    onClose={() => setEditingTask(null)} 
                    onSave={handleUpdateTask} 
                />
            )}

            {isNewTaskModalOpen && (
                <NewTaskModal 
                    onClose={() => setIsNewTaskModalOpen(false)} 
                    onSave={handleAddNewTask} 
                />
            )}

            {viewingTask && (<TaskDetailModal task={viewingTask} onClose={() => setViewingTask(null)} />)}
        </div>
    );
}