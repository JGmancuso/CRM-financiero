import React, { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import AgendaColumn from '../components/agenda/AgendaColumn';
import { useAgenda } from '../hooks/useAgenda';
import ActivityModal from '../components/modals/ActivityModal';
import TaskDetailModal from '../components/modals/TaskDetailModal';
import NewTaskModal from '../components/modals/NewTaskModal';
import { useData } from '../context/DataContext';


export default function AgendaView() {
    const { state, dispatch } = useData();
    const [filter, setFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');

    const { overdueTasks, tasksByDayOfWeek, futureTasks } = useAgenda(state.clients, state.tasks, state.negocios, filter, searchTerm);
    
    const [editingTask, setEditingTask] = useState(null);
    const [viewingTask, setViewingTask] = useState(null);
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
     

    const handleAddNewTask = (taskData) => {
        // Si la tarea tiene un 'clientId' y origen 'clientes'...
        if (taskData.clientId && taskData.source === 'clientes') {
            // ...la convertimos a un formato de "Actividad"
            const activityData = {
                description: taskData.title,
                dueDate: taskData.dueDate,
                completed: false,
            };
            // Y despachamos la acción para GUARDAR una ACTIVIDAD, no una TAREA
            dispatch({
                type: 'SAVE_ACTIVITY',
                payload: { clientId: taskData.clientId, activityData: activityData }
            });
        } else {
            // Si no, es una tarea general y se maneja como siempre
            dispatch({ type: 'ADD_TASK', payload: taskData });
        }
        setIsNewTaskModalOpen(false);
    };

    const handleUpdateTask = (taskData) => {
        if (taskData.source === 'clientes') {
            const activityData = { id: taskData.id, description: taskData.title, dueDate: taskData.dueDate, completed: taskData.isCompleted };
            dispatch({ type: 'UPDATE_ACTIVITY', payload: { clientId: taskData.clientId, activityData } });
        } else {
            const originalTask = state.tasks.find(t => t.id === taskData.id);
            const finalUpdatedTask = { ...originalTask, ...taskData };
            dispatch({ type: 'UPDATE_TASK', payload: finalUpdatedTask });
        }
        setEditingTask(null);
    };

    const handleToggleComplete = (task) => {
        // --- DEPURACIÓN ---
        console.log("Clic en 'completar'. Datos de la tarea recibidos:", task);
        // --- FIN DEPURACIÓN ---

        if (task.source === 'clientes') {
            dispatch({ 
                type: 'TOGGLE_ACTIVITY', 
                payload: { clientId: task.clientId, activityId: task.id } 
            });
        } else { 
            dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: task });
        }
    };
    
    const handleDeleteTask = (task) => {
        if (window.confirm(`¿Seguro que deseas eliminar la tarea "${task.title}"?`)) {
            if (task.source === 'clientes') {
                dispatch({ type: 'DELETE_ACTIVITY', payload: { clientId: task.clientId, activityId: task.id } });
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
                <button onClick={() => setIsNewTaskModalOpen(true)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center">
                    <PlusCircle size={18} className="mr-2"/> Nueva Tarea
                </button>
            </div>
            
            <div className="flex items-center justify-between mb-8">
                {/* ESTA ES LA ÚNICA BARRA DE FILTROS QUE DEBE QUEDAR */}
                <div className="flex space-x-2">
                    {filters.map(f => (
                        <button key={f.id} onClick={() => setFilter(f.id)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition ${filter === f.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                            {f.name}
                        </button>
                    ))}
                </div>
                {/* Campo de búsqueda */}
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
                        onDelete={handleDeleteTask} // <-- Esta prop faltaba
                    />
                ))}
                
            

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

            {/* 👇 Nos aseguramos de pasarle TODAS las funciones necesarias al modal de detalle 👇 */}
            {viewingTask && (
                <TaskDetailModal 
                    task={viewingTask} 
                    onClose={() => setViewingTask(null)}
                    onSave={handleUpdateTask}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                />
            )}
        </div>
    );
}