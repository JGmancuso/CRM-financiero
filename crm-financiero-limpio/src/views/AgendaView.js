import React, { useState } from 'react';
import { PlusCircle, Search, Database } from 'lucide-react';
import AgendaColumn from '../components/agenda/AgendaColumn';
import { useAgenda } from '../hooks/useAgenda';
import ActivityModal from '../components/modals/ActivityModal';
import TaskDetailModal from '../components/modals/TaskDetailModal';
import NewTaskModal from '../components/modals/NewTaskModal';
import { useData } from '../context/DataContext';
import DataInspectorModal from '../components/modals/DataInspectorModal';

export default function AgendaView() {
    const { state, dispatch } = useData();
    const [filter, setFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');

    const { overdueTasks, tasksByDayOfWeek, futureTasks } = useAgenda(state.clients, state.tasks, state.negocios, filter, searchTerm);
    
    const [editingTask, setEditingTask] = useState(null);
    const [viewingTask, setViewingTask] = useState(null);
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);

    const findClientOwner = (activityId) => {
        return state.clients.find(c => c.activities?.some(a => String(a.id).trim() === activityId));
    };

    const handleAddNewTask = (taskData) => {
        if (taskData.clientId && taskData.source === 'clientes') {
            const activityData = {
                description: taskData.title,
                dueDate: taskData.dueDate,
                details: taskData.details || '',
                completed: false,
            };
            dispatch({ type: 'SAVE_ACTIVITY', payload: { clientId: taskData.clientId, activityData } });
        } else {
            dispatch({ type: 'ADD_TASK', payload: taskData });
        }
        setIsNewTaskModalOpen(false);
    };

    // --- 👇 CORRECCIÓN AQUÍ: AÑADIDA LA FLECHA => 👇 ---
    const handleUpdateTask = (taskData) => {
        const taskId = String(taskData.id).trim();
        
        if (taskId.startsWith('act-')) {
            let clientId = taskData.clientId;
            if (!clientId) clientId = findClientOwner(taskId)?.id;

            if (clientId) {
                const activityData = {
                    id: taskId,
                    description: taskData.title,
                    details: taskData.details,
                    dueDate: taskData.dueDate,
                    completed: taskData.isCompleted,
                    isCompleted: taskData.isCompleted
                };
                 dispatch({ type: 'UPDATE_ACTIVITY', payload: { clientId, activityData } });
            } else {
                 alert("Error: No se pudo encontrar el cliente dueño de esta tarea.");
            }
        } else { 
            const originalTask = state.tasks.find(t => String(t.id).trim() === taskId);
            const finalUpdatedTask = { ...originalTask, ...taskData };
            dispatch({ type: 'UPDATE_TASK', payload: finalUpdatedTask });
        }
        setEditingTask(null);
        setViewingTask(null);
    };
    // --- 👆 FIN DE LA CORRECCIÓN 👆 ---

    const handleToggleComplete = (task) => {
        const taskId = String(task.id).trim();
        let clientId = task.clientId;
        if (!clientId && taskId.startsWith('act-')) {
            clientId = findClientOwner(taskId)?.id;
        }

        if (taskId.startsWith('act-') && clientId) {
             const newStatus = !task.isCompleted;
             dispatch({ 
                 type: 'TOGGLE_ACTIVITY', 
                 payload: { 
                     clientId: clientId, 
                     activityId: taskId,
                     targetStatus: newStatus 
                 } 
             });
        } else { 
            dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: task });
        }
    };
    
    const handleDeleteTask = (task) => {
        if (window.confirm(`¿Seguro que deseas eliminar la tarea "${task.title}"?`)) {
            const taskId = String(task.id).trim();
            let clientId = task.clientId;
            if (!clientId && taskId.startsWith('act-')) {
                clientId = findClientOwner(taskId)?.id;
            }

            if (taskId.startsWith('act-') && clientId) {
                dispatch({ type: 'DELETE_ACTIVITY', payload: { clientId: clientId, activityId: taskId } });
            } else {
                dispatch({ type: 'DELETE_TASK', payload: task.id });
            }
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
                <div className="flex space-x-3">
                    <button onClick={() => setIsInspectorOpen(true)} className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-900 flex items-center" title="Abrir Inspector de Datos">
                        <Database size={18} className="mr-2"/> Inspector
                    </button>
                    <button onClick={() => setIsNewTaskModalOpen(true)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center">
                        <PlusCircle size={18} className="mr-2"/> Nueva Tarea
                    </button>
                </div>
            </div>
            
            <div className="flex items-center justify-between mb-8">
                <div className="flex space-x-2">
                    {filters.map(f => (
                        <button key={f.id} onClick={() => setFilter(f.id)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition ${filter === f.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                            {f.name}
                        </button>
                    ))}
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Buscar en tareas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-full bg-white text-sm"
                    />
                </div>
            </div>            
            <div className="flex space-x-4 overflow-x-auto flex-grow pb-4">
                <AgendaColumn title="Vencidas" tasks={overdueTasks} onToggleComplete={handleToggleComplete} onEdit={setEditingTask} onView={setViewingTask} onDelete={handleDeleteTask} />
                {weekDays.map(day => (
                    <AgendaColumn 
                        key={day.id} 
                        title={day.name} 
                        tasks={tasksByDayOfWeek[day.id] || []} 
                        onToggleComplete={handleToggleComplete} 
                        onEdit={setEditingTask} 
                        onView={setViewingTask}
                        onDelete={handleDeleteTask}
                    />
                ))}
                <AgendaColumn title="Próximas" tasks={futureTasks} onToggleComplete={handleToggleComplete} onEdit={setEditingTask} onView={setViewingTask} onDelete={handleDeleteTask} />
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

            {viewingTask && (
                <TaskDetailModal 
                    task={viewingTask} 
                    onClose={() => setViewingTask(null)}
                    onSave={handleUpdateTask}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                />
            )}

            {isInspectorOpen && (
                <DataInspectorModal onClose={() => setIsInspectorOpen(false)} />
            )}
        </div>
    );
}