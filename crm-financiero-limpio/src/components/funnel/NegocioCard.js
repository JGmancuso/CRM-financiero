import React from 'react';
import { User, Clock, RefreshCw } from 'lucide-react'; // Se añadió RefreshCw

export default function NegocioCard({ negocio, onCardClick }) {
    if (!negocio) return null;

    const daysSince = (dateString) => {
        if (!dateString) return null;
        const today = new Date();
        const pastDate = new Date(dateString);
        today.setHours(0, 0, 0, 0);
        pastDate.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(today - pastDate);
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const findLastStageChangeDate = () => {
        if (!negocio.history || negocio.history.length === 0) return negocio.creationDate;
        const reversedHistory = [...negocio.history].reverse();
        const lastChange = reversedHistory.find(item => item.type && item.type.includes('Cambio de estado a:'));
        if (lastChange && lastChange.date) return lastChange.date;
        if (negocio.creationDate) return negocio.creationDate;
        return negocio.history[0].date;
    };

    const diasEnEstado = daysSince(findLastStageChangeDate());
    // NUEVA LÓGICA: Se añade el cálculo para la última modificación
    const diasDesdeUpdate = daysSince(negocio.lastUpdate);

    const getIndicatorStyle = (days) => {
        if (days === null) return 'bg-gray-100 text-gray-600';
        if (days <= 5) return 'bg-green-100 text-green-800';
        if (days <= 10) return 'bg-yellow-100 text-yellow-800';
        if (days <= 19) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    const montoFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency', currency: negocio.moneda || 'ARS',
    }).format(negocio.montoSolicitado || 0);

    return (
        <div onClick={() => onCardClick(negocio)} className="bg-white rounded-lg p-4 shadow-md border-l-4 border-gray-300 cursor-pointer hover:shadow-lg hover:border-blue-500">
            <h3 className="font-semibold text-gray-800 truncate">{negocio.nombre}</h3>
            <p className="text-sm text-gray-500 flex items-center mt-1">
                <User size={14} className="mr-2" /> {negocio.cliente.nombre || negocio.cliente.name}
            </p>
            <div className="flex justify-between items-end mt-2">
                <p className="text-lg font-semibold text-gray-900">{montoFormateado}</p>
                {/* NUEVA ESTRUCTURA: Contenedor para ambos indicadores */}
                <div className="flex items-center space-x-2">
                    {/* Indicador de última modificación */}
                    {diasDesdeUpdate !== null && (
                        <div className="flex items-center text-xs px-2 py-1 rounded-full font-semibold bg-gray-100 text-gray-600" title="Días desde última modificación">
                            <RefreshCw size={12} className="mr-1" />
                            {diasDesdeUpdate}d
                        </div>
                    )}
                    {/* Indicador de días en estado */}
                    {diasEnEstado !== null && (
                        <div className={`flex items-center text-xs px-2 py-1 rounded-full font-semibold ${getIndicatorStyle(diasEnEstado)}`} title="Días en este estado">
                            <Clock size={12} className="mr-1" />
                            {diasEnEstado}d
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}