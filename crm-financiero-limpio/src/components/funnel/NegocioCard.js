import React from 'react';
import { User, Clock, RefreshCw, Shield } from 'lucide-react'; // <-- 'Shield' añadido aquí
import { daysSince, findLastStageChangeDate } from '../../utils/negocioUtils';

export default function NegocioCard({ negocio, onCardClick }) {
    if (!negocio) return null;

    const diasEnEstado = daysSince(findLastStageChangeDate(negocio));
    const diasDesdeUpdate = daysSince(negocio.lastUpdate);

    const getIndicatorStyle = (days) => {
        if (days === null) return 'bg-gray-100 text-gray-600';
        if (days <= 5) return 'bg-green-100 text-green-800';
        if (days <= 10) return 'bg-yellow-100 text-yellow-800';
        if (days <= 19) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Aprobada':
                return 'bg-green-100 text-green-800';
            case 'Rechazada':
                return 'bg-red-100 text-red-800';
            case 'En Análisis':
                return 'bg-blue-100 text-blue-800';
            case 'Pendiente':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
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

            
            {negocio.calificaciones && negocio.calificaciones.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {negocio.calificaciones.map(cal => (
                        <span key={cal.id || cal.sgrId} className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(cal.estado)}`}>
                            <Shield size={12} className="mr-1" />
                            {cal.entidad || cal.sgrName}
                        </span>
                    ))}
                </div>
            )}
            

            <div className="flex justify-between items-end mt-2">
                <p className="text-lg font-semibold text-gray-900">{montoFormateado}</p>
                <div className="flex items-center space-x-2">
                    {diasDesdeUpdate !== null && (
                        <div className="flex items-center text-xs px-2 py-1 rounded-full font-semibold bg-gray-100 text-gray-600" title="Días desde última modificación">
                            <RefreshCw size={12} className="mr-1" />
                            {diasDesdeUpdate}d
                        </div>
                    )}
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