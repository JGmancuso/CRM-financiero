import React from 'react';
import { User, DollarSign, Clock } from 'lucide-react';

export default function NegocioCard({ negocio, onCardClick }) {
    if (!negocio) return null;

    const daysSince = (dateString) => {
        if (!dateString) return null;
        const today = new Date();
        const pastDate = new Date(dateString);
        today.setHours(0, 0, 0, 0);
        pastDate.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(today - pastDate);
        // Se ajusta para que el primer día cuente como 1
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    // --- 👇 FUNCIÓN MODIFICADA AQUÍ 👇 ---
    const findLastStageChangeDate = () => {
        if (!negocio.history || negocio.history.length === 0) {
            // Si no hay historial, intenta usar la fecha de creación
            return negocio.creationDate;
        }
        
        // 1. Busca el último cambio de estado explícito
        const reversedHistory = [...negocio.history].reverse();
        const lastChange = reversedHistory.find(item => item.type && item.type.includes('Cambio de estado a:'));
        if (lastChange && lastChange.date) {
            return lastChange.date;
        }

        // 2. Si no lo encuentra, busca la fecha de creación en el objeto
        if (negocio.creationDate) {
            return negocio.creationDate;
        }

        // 3. Como último recurso, usa la fecha del primer evento en el historial
        return negocio.history[0].date;
    };
    // --- 👆 FIN DE LA MODIFICACIÓN ---

    const diasEnEstado = daysSince(findLastStageChangeDate());

    const getIndicatorStyle = (days) => {
        if (days === null) return 'bg-gray-100 text-gray-600';
        if (days <= 5) return 'bg-green-100 text-green-800';
        if (days <= 10) return 'bg-yellow-100 text-yellow-800';
        if (days <= 19) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    const indicatorStyle = getIndicatorStyle(diasEnEstado);

    const montoFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: negocio.moneda || 'ARS',
    }).format(negocio.montoSolicitado || 0);

    return (
        <div
            onClick={() => onCardClick(negocio)}
            className="bg-white rounded-lg p-4 shadow-md border-l-4 border-gray-300 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-500"
        >
            <h3 className="font-semibold text-gray-800 truncate">{negocio.nombre}</h3>
            <p className="text-sm text-gray-500 flex items-center mt-1">
                <User size={14} className="mr-2" /> {negocio.cliente.nombre || negocio.cliente.name}
            </p>
            <div className="flex justify-between items-end mt-2">
                <p className="text-lg font-semibold text-gray-900">
                    {montoFormateado}
                </p>
                {diasEnEstado !== null && (
                    <div className={`flex items-center text-xs px-2 py-1 rounded-full font-semibold ${indicatorStyle}`}>
                        <Clock size={12} className="mr-1" />
                        {diasEnEstado}d
                    </div>
                )}
            </div>
        </div>
    );
}