import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Trash2, Search, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function GhostTasksModal({ onClose }) {
    const { state, dispatch } = useData();
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [processedIds, setProcessedIds] = useState([]);

    // 1. Filtro básico de fantasmas
    const ghostTasks = state.tasks.filter(t => 
        t.source === 'clientes' || 
        (typeof t.id === 'string' && t.id.startsWith('act-')) ||
        (t.clientId && !t.source)
    );

    // 2. Decidimos qué lista mostrar
    const tasksToShow = showAll ? state.tasks : ghostTasks;

    // 3. Filtramos por búsqueda y eliminamos las ya procesadas
    const filteredTasks = tasksToShow.filter(t => 
        !processedIds.includes(t.id) &&
        (t.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- FUNCIÓN PARA RESCATAR TAREA ---
    const handleRecoverTask = (task) => {
        if (!task.clientId) {
            alert("Error: Esta tarea no tiene un ID de cliente asociado, no se puede guardar en un historial.");
            return;
        }

        if (window.confirm(`¿Mover "${task.title}" al historial del cliente y eliminarla de la agenda general?`)) {
            // 1. Creamos la actividad para el cliente (ya completada para que vaya al historial)
            const activityData = {
                description: task.title,
                details: task.details || '',
                dueDate: task.dueDate,
                completed: true, 
            };
            
            // 2. La guardamos en el cliente correcto
            dispatch({
                type: 'SAVE_ACTIVITY',
                payload: { clientId: task.clientId, activityData }
            });

            // 3. La eliminamos de la lista general
            dispatch({ type: 'DELETE_TASK', payload: task.id });
            
            // 4. Actualizamos la UI
            setProcessedIds(prev => [...prev, task.id]);
        }
    };

    // --- FUNCIÓN PARA ELIMINAR TAREA ---
    const handleDeleteForce = (task) => {
        if (window.confirm(`¿Estás seguro de eliminar DEFINITIVAMENTE la tarea: "${task.title}"?`)) {
            dispatch({ type: 'DELETE_TASK', payload: task.id });
            setProcessedIds(prev => [...prev, task.id]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
                <div className={`p-4 border-b flex items-center rounded-t-lg flex-shrink-0 ${showAll ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'}`}>
                    <AlertTriangle className="mr-2" />
                    <h2 className="text-lg font-bold">{showAll ? 'MODO NUCLEAR: Todas las Tareas' : 'Limpieza de Tareas Inconsistentes'}</h2>
                </div>

                <div className="p-4 border-b bg-gray-50 flex justify-between items-center flex-shrink-0">
                    <div className="relative flex-grow mr-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Buscar por título..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
                        />
                    </div>
                    <button 
                        onClick={() => setShowAll(!showAll)} 
                        className={`text-sm px-3 py-2 rounded border font-semibold transition-colors ${showAll ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
                    >
                        {showAll ? 'Ver solo fantasmas' : 'Mostrar TODAS'}
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow bg-gray-100">
                    {filteredTasks.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow-sm">
                            <CheckCircle size={48} className="mx-auto mb-2 text-green-500" />
                            <p className="font-semibold">No se encontraron tareas.</p>
                            <p className="text-sm">Intenta cambiar el término de búsqueda o el modo de vista.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredTasks.map(task => (
                                <div key={task.id} className="bg-white border rounded-lg p-3 flex justify-between items-center text-sm shadow-sm hover:shadow-md transition-shadow">
                                    <div className="overflow-hidden mr-4">
                                        <p className="font-bold text-gray-800 truncate" title={task.title}>{task.title}</p>
                                        <div className="text-xs text-gray-500 flex flex-col mt-1">
                                            <span className="font-mono bg-gray-100 px-1 rounded w-fit mb-0.5">ID: {task.id}</span>
                                            <span>Cliente: {task.clientName || 'Sin cliente asignado'}</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 flex-shrink-0">
                                        {/* Solo mostramos el botón de rescatar si tiene un ID de cliente */}
                                        {task.clientId && (
                                            <button 
                                                onClick={() => handleRecoverTask(task)}
                                                className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-blue-200 flex items-center"
                                                title="Mover al historial del cliente"
                                            >
                                                <Save size={14} className="mr-1"/> RESCATAR
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteForce(task)}
                                            className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-200 flex items-center"
                                            title="Eliminar definitivamente"
                                        >
                                            <Trash2 size={14} className="mr-1"/> ELIMINAR
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="p-4 border-t bg-white flex justify-end rounded-b-lg flex-shrink-0">
                    <button onClick={onClose} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 font-semibold">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}