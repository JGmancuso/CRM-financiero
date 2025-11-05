import React, { useState } from 'react';
import { Search, Trash2, Database, User, UserPlus, Wrench, PenTool } from 'lucide-react'; // Añadido PenTool
import { useData } from '../../context/DataContext';

export default function DataInspectorModal({ onClose }) {
    const { state, dispatch } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [adoptTargetClient, setAdoptTargetClient] = useState('');
    
    // Estados para la reparación directa
    const [repairId, setRepairId] = useState('');
    const [repairName, setRepairName] = useState('');

    // ... (Filtros de búsqueda existentes) ...
    const tasksFound = state.tasks.filter(t => (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (t.id || '').includes(searchTerm));
    const clientActivitiesFound = [];
    state.clients.forEach(client => {
        if (client.activities) {
            client.activities.forEach(act => {
                if ((act.description || '').toLowerCase().includes(searchTerm.toLowerCase()) || (act.id || '').includes(searchTerm)) {
                    clientActivitiesFound.push({ ...act, clientName: client.name, realClientId: client.id });
                }
            });
        }
    });

    // Cliente encontrado para reparación
    const clientToRepair = state.clients.find(c => c.id === repairId.trim());

    const handleDirectRepair = () => {
        if (clientToRepair && repairName.trim()) {
            dispatch({ type: 'UPDATE_CLIENT', payload: { ...clientToRepair, name: repairName, nombre: repairName } });
            alert(`✅ Cliente actualizado correctamente a: ${repairName}`);
            setRepairId('');
            setRepairName('');
        }
    };

    // ... (Resto de manejadores: handleAdoptTask, deletes...)
    const handleAdoptTask = (activity, currentClientId, isFromGeneralList) => { if (!adoptTargetClient) { alert("Selecciona cliente destino."); return; } if (window.confirm(`¿Mover tarea?`)) { const activityData = { description: activity.title || activity.description, details: activity.details || '', dueDate: activity.dueDate, completed: activity.completed || false }; dispatch({ type: 'SAVE_ACTIVITY', payload: { clientId: adoptTargetClient, activityData } }); if (isFromGeneralList) dispatch({ type: 'DELETE_TASK', payload: activity.id }); else dispatch({ type: 'FORCE_DELETE_ACTIVITY_ANYWHERE', payload: activity.id }); } };
    const handleForceDeleteFromTasks = (id) => { if (window.confirm("¿Borrar?")) dispatch({ type: 'DELETE_TASK', payload: id }); };
    const handleForceDeleteFromClient = (clientId, activityId) => { if (window.confirm("¿Borrar?")) dispatch({ type: 'DELETE_ACTIVITY', payload: { clientId, activityId } }); };
    const handleForceComplete = (activity, clientId) => {
        if (window.confirm(`¿Forzar que la tarea "${activity.description || activity.title}" aparezca como COMPLETADA?`)) {
            // Creamos una versión actualizada de la actividad con los flags de completado en TRUE
            const forcedActivity = { 
                ...activity, 
                completed: true, 
                isCompleted: true 
            };
            
            // Enviamos la orden directa de actualización al reducer
            dispatch({ 
                type: 'UPDATE_ACTIVITY', 
                payload: { clientId: clientId, activityData: forcedActivity } 
            });
            
            alert("✅ Orden de completado forzoso enviada.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-start z-50 overflow-y-auto p-4 md:p-8">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl my-8">
                <div className="bg-gray-800 text-white p-4 rounded-t-xl flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-xl font-bold flex items-center"><Database className="mr-2"/> Inspector y Reparador</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div className="p-6 space-y-6 bg-gray-100">
                    
                    {/* 👇 SECCIÓN DE REPARACIÓN DIRECTA POR ID 👇 */}
                    <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl shadow-sm">
                        <h3 className="text-blue-800 font-bold flex items-center mb-3"><PenTool className="mr-2"/> Reparación Directa de Cliente</h3>
                        <p className="text-sm text-blue-600 mb-3">Pega aquí el ID de un cliente corrupto para ponerle nombre.</p>
                        <div className="flex space-x-3 mb-2">
                            <input 
                                type="text" 
                                placeholder="Pegar ID del Cliente (ej: client-1755...)" 
                                value={repairId}
                                onChange={(e) => setRepairId(e.target.value)}
                                className="flex-1 border rounded-lg px-3 py-2 font-mono text-sm"
                            />
                            <input 
                                type="text" 
                                placeholder="Nuevo Nombre para el Cliente" 
                                value={repairName}
                                onChange={(e) => setRepairName(e.target.value)}
                                className="flex-1 border rounded-lg px-3 py-2 font-semibold"
                                disabled={!clientToRepair}
                            />
                            <button 
                                onClick={handleDirectRepair} 
                                disabled={!clientToRepair || !repairName.trim()}
                                className={`px-4 py-2 rounded-lg font-bold text-white ${(!clientToRepair || !repairName.trim()) ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                APLICAR NOMBRE
                            </button>
                        </div>
                        {repairId && !clientToRepair && <p className="text-red-500 text-sm font-bold mt-1">❌ No se encontró ningún cliente con ese ID.</p>}
                        {clientToRepair && <p className="text-green-600 text-sm mt-1">✅ Cliente encontrado. Nombre actual: <strong>{clientToRepair.name || '(VACÍO)'}</strong></p>}
                    </div>
                    {/* --------------------------------------------- */}

                    {/* ... (El resto del inspector sigue igual: Selector de adopción, Buscador, Resultados...) */}
                    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border shadow-sm sticky top-0 z-index-10">
                         <UserPlus className="text-gray-500" />
                        <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">Asignar tarea encontrada a:</span>
                        <select value={adoptTargetClient} onChange={(e) => setAdoptTargetClient(e.target.value)} className="flex-grow p-2 border rounded text-sm">
                            <option value="">-- Selecciona Cliente Destino --</option>
                            {state.clients.map(c => (<option key={c.id} value={c.id}>{c.name || c.nombre || '(Sin Nombre)'} [{c.id}]</option>))}
                        </select>
                    </div>
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Buscar tarea corrupta..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg outline-none font-medium" />
                    </div>
                    {/* ... (Renderizado de resultados tasksFound y clientActivitiesFound) ... */}
                     <div>
                        <h3 className="font-bold mb-2 flex items-center text-purple-700"><Database className="mr-2" size={16}/> En Lista General: {tasksFound.length}</h3>
                                <div className="space-y-2 ml-4 max-h-60 overflow-y-auto">
                                    {clientActivitiesFound.map(act => (
                                        <div key={act.id} className="border-2 border-green-200 rounded p-2 flex justify-between items-center bg-green-50/50 text-sm">
                                                <span className="truncate mr-2 font-medium">
                                                    {/* Mostramos si ya está completada o no */}
                                                    {act.completed ? '✅ ' : '⬜ '} 
                                                    {act.description} 
                                                    <span className="text-xs text-gray-500"> ({act.id})</span>
                                                </span>
                                                <div className="flex-shrink-0 flex space-x-1">
                                                
                                                {/* 👇 BOTÓN DE FORZAR COMPLETADO 👇 */}
                                                {!act.completed && (
                                                    <button 
                                                        onClick={() => handleForceComplete(act, act.realClientId)}
                                                        className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-700"
                                                        title="Forzar marcar como completada"
                                                    >
                                                        ✅ FORZAR
                                                    </button>
                                                )}
                                                {/* -------------------------------- */}

                                                <button onClick={() => handleAdoptTask(act, act.realClientId, false)} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">ADOPTAR</button>
                                                <button onClick={() => handleForceDeleteFromClient(act.realClientId, act.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">BORRAR</button>
                                                </div>
                                        </div>
                                    ))}
                                </div>
                    </div>
                     <div>
                        <h3 className="font-bold mb-2 flex items-center text-green-700 mt-4"><User className="mr-2" size={16}/> En Clientes: {clientActivitiesFound.length}</h3>
                        <div className="space-y-2 ml-4 max-h-60 overflow-y-auto">
                            {clientActivitiesFound.map(act => (
                                <div key={act.id} className="border-2 border-green-200 rounded p-2 flex justify-between items-center bg-green-50/50 text-sm">
                                     <span className="truncate mr-2 font-medium">{act.description} <span className="text-xs text-gray-500">en {act.clientName || act.realClientId}</span></span>
                                     <div className="flex-shrink-0">
                                        <button onClick={() => handleAdoptTask(act, act.realClientId, false)} className="bg-blue-600 text-white px-2 py-1 rounded mr-1 text-xs">ADOPTAR</button>
                                        <button onClick={() => handleForceDeleteFromClient(act.realClientId, act.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">BORRAR</button>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}