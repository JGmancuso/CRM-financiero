// src/components/funnel/NegocioCard.js

import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
// Sugiero usar íconos más descriptivos para el negocio
import { Briefcase, User, ChevronDown, ChevronUp, DollarSign, Calendar } from 'lucide-react';
import FunnelStatusModal from '../modals/FunnelStatusModal'; // Lo necesitaremos

export default function NegocioCard({ negocio, index, onUpdateNegocio }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);

    // Si no hay un negocio, no mostramos nada. Buena práctica.
    if (!negocio) {
        return null;
    }
    
    // --- Lógica para el modal (la adaptaremos) ---
    const handleStatusSave = (nuevosDatos) => {
        const negocioActualizado = {
            ...negocio,
            ...nuevosDatos, // El modal nos devolverá los campos actualizados
            // Aquí podríamos agregar la lógica para el historial
        };
        onUpdateNegocio(negocioActualizado);
        setStatusModalOpen(false);
    };

    // --- Formateo de datos (de nuestra versión anterior) ---
    const montoFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(negocio.montoSolicitado || 0);

    const fechaSeguimiento = new Date(negocio.fechaProximoSeguimiento).toLocaleDateString('es-AR');

    return (
        <>
            <Draggable draggableId={negocio.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white rounded-lg p-4 shadow-md border-l-4 ${snapshot.isDragging ? 'border-blue-500' : 'border-gray-300'}`}
                    >
                        {/* --- Vista Principal (No expandida) --- */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-gray-800">{negocio.nombre}</h3>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                    <User size={14} className="mr-2" /> {negocio.cliente.nombre}
                                </p>
                            </div>
                            <button onClick={() => setIsExpanded(!isExpanded)} className="p-1">
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                        </div>

                        {/* --- Vista Expandida --- */}
                        {isExpanded && (
                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <DollarSign size={14} className="mr-2" />
                                    <span>Monto Solicitado: {montoFormateado}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Briefcase size={14} className="mr-2" />
                                    <span>CUIT: {negocio.cliente.cuit}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar size={14} className="mr-2" />
                                    <span>Próx. seguimiento: {fechaSeguimiento}</span>
                                </div>
                                <button
                                    onClick={() => setStatusModalOpen(true)}
                                    className="w-full mt-2 text-left text-blue-600 font-semibold hover:underline"
                                >
                                    Gestionar Negocio...
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Draggable>

            {isStatusModalOpen && (
                <FunnelStatusModal
                    negocio={negocio} // Le pasamos el objeto 'negocio'
                    onClose={() => setStatusModalOpen(false)}
                    onSave={handleStatusSave}
                />
            )}
        </>
    );
}