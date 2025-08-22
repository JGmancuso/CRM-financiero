// src/components/funnel/NegocioCard.js

import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
// 👇 1. He añadido los nuevos íconos que usaremos
import { 
    Briefcase, User, ChevronDown, ChevronUp, DollarSign, Calendar, 
    Flag, AlertTriangle, Info 
} from 'lucide-react';
// El modal lo gestiona el hook, así que no lo necesitamos aquí.

export default function NegocioCard({ negocio, index }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!negocio) {
        return null;
    }
    
    const montoFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(negocio.montoSolicitado || 0);

    const fechaSeguimiento = negocio.fechaProximoSeguimiento 
        ? new Date(negocio.fechaProximoSeguimiento).toLocaleDateString('es-AR')
        : 'No definida';

    return (
        <Draggable draggableId={negocio.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white rounded-lg p-4 shadow-md border-l-4 transition-all duration-200 ${snapshot.isDragging ? 'border-blue-500 shadow-xl' : 'border-gray-300'}`}
                >
                    {/* --- Vista Principal (No expandida) --- */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-800">{negocio.nombre}</h3>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                                <User size={14} className="mr-2" /> {negocio.cliente.nombre}
                            </p>
                        </div>
                        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 text-gray-500 hover:text-gray-800">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>

                    {/* --- Vista Expandida --- */}
                    {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-sm animate-fade-in">
                            {/* --- INICIO: NUEVOS CAMPOS DE DETALLE --- */}
                            {negocio.proximosPasos && (
                                <div className="flex items-start text-green-800 bg-green-50 p-2 rounded-md">
                                    <Flag size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold block">Próximos Pasos:</span>
                                        <p>{negocio.proximosPasos}</p>
                                    </div>
                                </div>
                            )}
                            {negocio.documentacionFaltante && (
                                <div className="flex items-start text-yellow-800 bg-yellow-50 p-2 rounded-md">
                                    <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold block">Faltante:</span>
                                        <p>{negocio.documentacionFaltante}</p>
                                    </div>
                                </div>
                            )}
                            {negocio.motivoUltimoCambio && (
                                <div className="flex items-start text-gray-700 bg-gray-100 p-2 rounded-md">
                                    <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold block">Último Motivo:</span>
                                        <p>{negocio.motivoUltimoCambio}</p>
                                    </div>
                                </div>
                            )}
                            {/* --- FIN: NUEVOS CAMPOS DE DETALLE --- */}

                            <div className="flex items-center text-gray-600 pt-2">
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
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
}