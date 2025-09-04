import React, { useState, useEffect } from 'react'; 
import { X, Briefcase, Calendar, Info, DollarSign, Flag, ShieldCheck, Edit, Save, Trash2, CheckSquare } from 'lucide-react';
import { daysSince, findLastStageChangeDate } from '../../utils/negocioUtils';

export default function TaskDetailModal({ task, onClose, onSave, onToggleComplete, onDelete }) {
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(task);

    useEffect(() => { 
        setFormData(task); 
    }, [task]);
    
    if (!task) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };
    
    const handleCompleteClick = () => onToggleComplete(task);
    const handleDeleteClick = () => {
        onDelete(task);
        onClose();
    };

    const montoFormateado = task.businessInfo?.monto 
        ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: task.businessInfo.moneda }).format(task.businessInfo.monto)
        : null;
    
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative max-h-[90vh] flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={28} />
                </button>

                {/* Encabezado de la Tarea */}
                <div className="pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
                    <p className="text-gray-500 mt-1">Cliente: {task.clientName}</p>
                    <div className="flex items-center text-sm mt-2">
                        <Calendar size={14} className="mr-2 text-gray-500"/>
                        <span>Vence: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('es-AR')}</span>
                        <span className="mx-2">•</span>
                        <span className={`font-semibold ${task.isCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                            {task.isCompleted ? 'Completada' : 'Pendiente'}
                        </span>
                    </div>
                </div>

                {/* Cuerpo del Modal */}
                <div className="flex-grow overflow-y-auto pt-6 space-y-6">
                    {/* Detalles de la Tarea */}
                    {task.details && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-2">
                                <Info size={20} className="mr-2 text-blue-500" />
                                Notas de la Tarea
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
                                <p>{task.details}</p>
                            </div>
                        </div>
                    )}

                    {/* Resumen del Negocio Asociado */}
                    {task.businessInfo && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-2">
                                <Briefcase size={20} className="mr-2 text-purple-500" />
                                Resumen del Negocio Vinculado
                            </h3>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md text-gray-700">
                                <div className="flex items-center">
                                    <Flag size={16} className="mr-2 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Estado</p>
                                        <p className="font-semibold">{task.businessInfo.estado}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <DollarSign size={16} className="mr-2 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Monto</p>
                                        <p className="font-semibold">{montoFormateado}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* --- 👇 SECCIÓN DE CALIFICACIONES CORREGIDA Y COMPLETADA 👇 --- */}
                    {task.businessInfo?.estado === 'EN_CALIFICACION' && task.businessInfo.calificacionesSGR?.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 ...">
                                <ShieldCheck size={20} className="mr-2 text-green-500" />
                                Calificaciones a Entidades
                            </h3>
                            <div className="space-y-3 bg-gray-50 p-4 rounded-md">
                                {task.businessInfo.calificacionesSGR.map(cal => {
                                    // --- 👇 ESPÍA DE DEPURACIÓN AÑADIDO AQUÍ 👇 ---
                                    console.log('Datos de la calificación individual:', cal);
                                    // --- 👆 FIN DEL ESPÍA 👆 ---
                                    const diasEnAnalisis = daysSince(cal.fechaPresentacion);
                                    return (
                                        <div key={cal.id} className="border p-3 bg-white rounded-lg shadow-sm">
                                            <p className="font-bold text-gray-800">{cal.entidad}</p>
                                            <p className="text-sm text-gray-600">Estado: <span className="font-semibold">{cal.estado}</span></p>
                                            {cal.estado === 'En Análisis' && diasEnAnalisis > 0 && (
                                                <div className="mt-2 text-xs text-yellow-800 bg-yellow-100 p-2 rounded-md font-semibold inline-block">
                                                    En análisis hace {diasEnAnalisis} día(s).
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    {/* --- 👆 FIN DE LA SECCIÓN 👆 --- */}
                    <div className="flex-shrink-0 pt-6 border-t flex justify-between items-center">
                    <div className="flex space-x-2">
                        <button onClick={handleCompleteClick} className={`flex items-center font-semibold py-2 px-4 rounded-lg ${task.isCompleted ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                            <CheckSquare size={16} className="mr-2"/> {task.isCompleted ? 'Completada' : 'Marcar como Completada'}
                        </button>
                        <button onClick={handleDeleteClick} className="flex items-center text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-50">
                            <Trash2 size={16} className="mr-2"/> Eliminar
                        </button>
                    </div>
                    <div>
                        {isEditing ? (
                            <button onClick={handleSave} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 flex items-center">
                                <Save size={16} className="mr-2"/> Guardar Cambios
                            </button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="flex items-center text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50">
                                <Edit size={16} className="mr-2"/> Editar Tarea
                            </button>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}