import React from 'react';
import { useAgenda } from '../../hooks/useAgenda';
import { Calendar, CheckSquare, AlertCircle, Clock } from 'lucide-react';

// Este componente recibe la lista de clientes y tareas, y las funciones para interactuar con ellas
export default function AgendaPanel({ clients, tasks, onUpdateTask }) {

    const { overdueTasks, eventsToday, upcomingEvents } = useAgenda(clients, tasks);

    const handleToggleTask = (task) => {
        if (onUpdateTask) {
            onUpdateTask({ ...task, isCompleted: !task.isCompleted });
        }
    };

    // Sub-componente para renderizar cada item de la lista de tareas
    const TaskItem = ({ task, colorClass }) => (
        <div className={`p-3 ${colorClass} rounded-lg`}>
            <div className="flex items-center">
                <div className="flex-grow">
                    <p className={`font-semibold ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.title}</p>
                    <p className={`text-sm ${task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>{task.clientName}</p>
                    <p className={`text-sm ${task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                        Vence: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-AR', {timeZone: 'UTC'}) : 'Sin fecha'}
                    </p>
                </div>
                {!task.isCompleted && (
                    <button onClick={() => handleToggleTask(task)} title="Completar" className="p-1 text-gray-500 hover:text-green-600">
                        <CheckSquare size={18}/>
                    </button>
                )}
            </div>
            {task.details && (
                <div className="mt-2 text-xs text-gray-700 bg-gray-100 p-2 rounded-md border-l-2 border-gray-300">
                    <span className="font-semibold">Detalle:</span>
                    <p className="italic">"{task.details}"</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg space-y-6">
            <div>
                <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center"><AlertCircle className="mr-2"/> Vencidas</h2>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {overdueTasks.length > 0 ? overdueTasks.map(task => (
                        <TaskItem key={task.id} task={task} colorClass="bg-red-50" />
                    )) : <p className="text-gray-500 text-sm">No hay tareas vencidas.</p>}
                </div>
            </div>
            
            <div>
                <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center"><Calendar className="mr-2"/> Para Hoy</h2>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {eventsToday.length > 0 ? eventsToday.map(event => (
                        <TaskItem key={event.id} task={event} colorClass="bg-blue-50" />
                    )) : <p className="text-gray-500 text-sm">No hay tareas para hoy.</p>}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center"><Clock className="mr-2"/> Próximos 14 Días</h2>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                    {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                        <TaskItem key={event.id} task={event} colorClass="bg-gray-50" />
                    )) : <p className="text-gray-500 text-sm">No hay tareas próximas.</p>}
                </div>
            </div>
        </div>
    );
}