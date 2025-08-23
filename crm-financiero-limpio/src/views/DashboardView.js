import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { FUNNEL_STAGES } from '../data';
import AgendaPanel from '../components/dashboard/AgendaPanel';
import FunnelStatsPanel from '../components/dashboard/FunnelStatsPanel';
import ActivityModal from '../components/modals/ActivityModal';
import FunnelStageDetailModal from '../components/modals/FunnelStageDetailModal';

export default function DashboardView({ clients, negocios, tasks, onAddTask, onUpdateTask, onNewClient, onNavigateToClient }) {
    const [editingActivity, setEditingActivity] = useState(null);
    const [viewingStage, setViewingStage] = useState(null);

    const handleSaveTask = (taskData) => {
        if (taskData.id) {
            onUpdateTask(taskData);
        } else {
            onAddTask(taskData);
        }
        setEditingActivity(null);
    };

    return (
        <div className="p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                 <h1 className="text-3xl font-bold text-gray-800">Panel de Inicio</h1>
                 <div className="flex space-x-2">
                    <button onClick={() => setEditingActivity({})} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center">
                        <PlusCircle size={18} className="mr-2"/> Nuevo Evento
                    </button>
                    <button onClick={onNewClient} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
                        <PlusCircle size={18} className="mr-2"/> Nuevo Cliente
                    </button>
                 </div>
            </div>
            
            {/* El layout principal ahora llama a los nuevos componentes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <AgendaPanel clients={clients} tasks={tasks} onUpdateTask={onUpdateTask} />
                <FunnelStatsPanel negocios={negocios} onStageClick={setViewingStage} />
            </div>

            {/* Los modales siguen siendo gestionados por la vista principal */}
            {editingActivity && (
                <ActivityModal 
                    activityToEdit={editingActivity.id ? editingActivity : null} 
                    onClose={() => setEditingActivity(null)} 
                    onSave={handleSaveTask} 
                />
            )}
            {viewingStage && (
                <FunnelStageDetailModal 
                    stageName={viewingStage} 
                    negocios={negocios.filter(n => FUNNEL_STAGES[n.estado] === viewingStage)} 
                    onClose={() => setViewingStage(null)} 
                    onClientSelect={onNavigateToClient} 
                />
            )}
        </div>
    );
}