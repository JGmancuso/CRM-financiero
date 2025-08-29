import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { getUnifiedAgendaItems, categorizeTasksForDashboard } from '../../utils/agendaUtils';
import DashboardTaskItem from './DashboardTaskItem';

const AgendaColumn = ({ title, tasks, onToggleComplete, onEdit }) => (
    <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase">{title} ({tasks.length})</h3>
        <div className="space-y-2">
            {tasks.length > 0 ? (
                tasks.map(task => (
                    <DashboardTaskItem 
                        key={`${task.source}-${task.id}`} 
                        task={task} 
                        onToggleComplete={onToggleComplete}
                        onEdit={onEdit}
                    />
                ))
            ) : (
                <p className="text-sm text-gray-400 italic">Nada por aquí.</p>
            )}
        </div>
    </div>
);

export default function AgendaPanel({ onEditTask }) {
    const { state, dispatch } = useData();

    // Obtenemos la lista unificada de todas las tareas
    const allTasks = useMemo(
        () => getUnifiedAgendaItems(state.clients, state.tasks, state.negocios), 
        [state.clients, state.tasks, state.negocios]
    );

    // Esta función ya filtra correctamente las tareas completadas
    const { overdue, forToday, upcoming } = categorizeTasksForDashboard(allTasks);

    // Esta función despacha la acción para completar la tarea
    const handleToggleComplete = (task) => {
        // --- INICIO DE DEPURACIÓN ---
        // --- DEPURACIÓN ---
        console.log("COMPLETAR - Paso 3: Clic para completar esta tarea unificada", task);
        // --- FIN DEPURACIÓN ---
        // --- FIN DE DEPURACIÓN ---
        if (task.source === 'clientes') {
            dispatch({ type: 'TOGGLE_ACTIVITY', payload: { clientId: task.clientId, activityId: task.id } });
        } else {
            dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: task });
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mi Agenda</h2>
            <div className="space-y-6 flex-grow overflow-y-auto pr-2">
                <AgendaColumn title="Vencidas" tasks={overdue} onToggleComplete={handleToggleComplete} onEdit={onEditTask} />
                <AgendaColumn title="Para Hoy" tasks={forToday} onToggleComplete={handleToggleComplete} onEdit={onEditTask} />
                <AgendaColumn title="Próximas" tasks={upcoming} onToggleComplete={handleToggleComplete} onEdit={onEditTask} />
            </div>
        </div>
    );
}