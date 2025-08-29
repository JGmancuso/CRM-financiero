import React, { useState } from 'react';
import NegocioCard from './NegocioCard';
import { ChevronRight, ChevronDown, Clock, RefreshCw } from 'lucide-react';
// Importamos las funciones de cálculo que necesitamos
import { daysSince, findLastStageChangeDate } from '../../utils/negocioUtils';

export default function ClientGroup({ clientName, negocios, onCardClick }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const totalNegocios = negocios.length;
    
    // --- 👇 LÓGICA AÑADIDA PARA CALCULAR DÍAS MÁXIMOS 👇 ---
    const maxDiasEnEstado = Math.max(...negocios.map(n => daysSince(findLastStageChangeDate(n))));
    const maxDiasDesdeUpdate = Math.max(...negocios.map(n => daysSince(n.lastUpdate)));
    // --- 👆 FIN DE LA LÓGICA AÑADIDA 👆 ---

    // Si solo hay un negocio, lo mostramos directamente sin agrupar.
    if (totalNegocios === 1) {
        return (
            <div className="mb-4">
                <NegocioCard 
                    key={negocios[0].id} 
                    negocio={negocios[0]} 
                    onCardClick={onCardClick} 
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm mb-3">
            {/* Fila de Resumen Clickeable */}
            <div 
                className="p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-gray-800">{clientName} ({totalNegocios})</h4>
                        {/* Mostramos los títulos si está contraído */}
                        {!isExpanded && (
                            <div className="mt-2 pl-4 border-l-2 border-gray-200">
                                {negocios.map(negocio => (
                                    <div key={negocio.id} className="text-sm text-gray-600 truncate">
                                        <span className="font-semibold">{negocio.nombre}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* --- 👇 SECCIÓN DE CONTADORES DE DÍAS AÑADIDA 👇 --- */}
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                        <div className="flex items-center text-xs px-2 py-1 rounded-full font-semibold bg-gray-100 text-gray-600" title="Días máx. desde modificación">
                            <RefreshCw size={12} className="mr-1" />
                            {maxDiasDesdeUpdate}d
                        </div>
                        <div className="flex items-center text-xs px-2 py-1 rounded-full font-semibold bg-red-100 text-red-800" title="Días máx. en estado">
                            <Clock size={12} className="mr-1" />
                            {maxDiasEnEstado}d
                        </div>
                        {isExpanded ? <ChevronDown className="text-gray-500" /> : <ChevronRight className="text-gray-500" />}
                    </div>
                    {/* --- 👆 FIN DE LA SECCIÓN 👆 --- */}
                </div>
            </div>

            {/* Contenido Desplegable: Las tarjetas de negocio */}
            {isExpanded && (
                <div className="p-3 border-t border-gray-200 space-y-3">
                    {negocios.map(negocio => (
                        <NegocioCard 
                            key={negocio.id} 
                            negocio={negocio} 
                            onCardClick={onCardClick} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}