import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlusCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import AgendaPanel from '../components/dashboard/AgendaPanel';
import FunnelStatsPanel from '../components/dashboard/FunnelStatsPanel';
import NewTaskModal from '../components/modals/NewTaskModal';
import ActivityModal from '../components/modals/ActivityModal';
import FunnelStageDetailModal from '../components/modals/FunnelStageDetailModal';
import { FUNNEL_STAGES } from '../data';

export default function DashboardView({ onNavigateToClient }) {
    const { state, dispatch } = useData();
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [viewingStage, setViewingStage] = useState(null);

    // --- 👇 Lógica para Paneles Ajustables (sin librerías) 👇 ---
    const [leftPanelWidth, setLeftPanelWidth] = useState(60); // Ancho inicial del panel izquierdo en %
    const isResizing = useRef(false);

    const handleMouseDown = (e) => {
        e.preventDefault();
        isResizing.current = true;
    };

    const handleMouseUp = useCallback(() => {
        isResizing.current = false;
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isResizing.current) {
            return;
        }
        const newLeftWidth = (e.clientX / window.innerWidth) * 100;
        // Establecemos límites para que los paneles no desaparezcan
        if (newLeftWidth > 30 && newLeftWidth < 70) {
            setLeftPanelWidth(newLeftWidth);
        }
    }, []);

    useEffect(() => {
        // Añadimos los listeners al documento para que el arrastre funcione en toda la pantalla
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        // Limpiamos los listeners cuando el componente se desmonta para evitar fugas de memoria
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);
    // --- 👆 Fin de la Lógica para Paneles Ajustables 👆 ---


    const handleAddNewTask = (taskData) => {
        dispatch({ type: 'ADD_TASK', payload: taskData });
        setIsNewTaskModalOpen(false);
    };

    const handleUpdateTask = (taskData) => {
        const originalTask = state.tasks.find(t => t.id === taskData.id);
        const finalUpdatedTask = { ...originalTask, ...taskData };
        dispatch({ type: 'UPDATE_TASK', payload: finalUpdatedTask });
        setEditingTask(null);
    };

    return (
        <div className="p-8 h-full flex flex-col animate-fade-in">
            <div className="flex justify-between items-center mb-8 flex-shrink-0">
                 <h1 className="text-3xl font-bold text-gray-800">Panel de Inicio</h1>
                 <div className="flex space-x-2">
                    <button onClick={() => setIsNewTaskModalOpen(true)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center">
                        <PlusCircle size={18} className="mr-2"/> Nueva Tarea
                    </button>
                    <button onClick={onNavigateToClient} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
                        <PlusCircle size={18} className="mr-2"/> Nuevo Cliente
                    </button>
                 </div>
            </div>
            
            {/* El div principal ahora es un contenedor flex */}
            <div className="flex-grow flex h-full overflow-hidden">
                {/* Panel Izquierdo (Agenda) */}
                <div style={{ width: `${leftPanelWidth}%` }}>
                    <AgendaPanel onEditTask={setEditingTask} />
                </div>

                {/* Divisor Arrastrable */}
                <div 
                    onMouseDown={handleMouseDown}
                    className="w-2 cursor-col-resize bg-gray-200 hover:bg-blue-300 transition-colors"
                />

                {/* Panel Derecho (Estadísticas) */}
                <div className="flex-grow">
                    <FunnelStatsPanel negocios={state.negocios} onStageClick={setViewingStage} />
                </div>
            </div>

            {/* Modales */}
            {isNewTaskModalOpen && <NewTaskModal onClose={() => setIsNewTaskModalOpen(false)} onSave={handleAddNewTask} />}
            {editingTask && <ActivityModal activityToEdit={editingTask} onClose={() => setEditingTask(null)} onSave={handleUpdateTask} />}
            {viewingStage && <FunnelStageDetailModal stageName={viewingStage} negocios={state.negocios.filter(n => FUNNEL_STAGES[n.estado] === viewingStage)} onClose={() => setViewingStage(null)} onClientSelect={onNavigateToClient} />}
        </div>
    );
}