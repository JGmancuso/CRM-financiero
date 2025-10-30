import React from 'react';

export default function WeeklyVolumeChart({ data }) {
    if (!data || !data.current || data.current.length === 0) {
        return <div className="text-sm text-gray-400">No hay datos de volumen.</div>;
    }

    const { current, historicalMax, lastYearMax } = data;
    const overallMax = Math.max(historicalMax, lastYearMax, ...current);

    return (
        <div className="bg-gray-50 p-4 rounded-lg mt-2">
            <h4 className="font-semibold text-xs text-gray-600 mb-2">Volumen Semanal (Últ. 6 Meses)</h4>
            <div className="relative h-40 flex items-end space-x-1">
                {/* Líneas de referencia */}
                <div className="absolute w-full border-t-2 border-dashed border-red-400" style={{ bottom: `${(historicalMax / overallMax) * 100}%` }}>
                    <span className="text-xs text-red-500 bg-gray-50 px-1 -mt-2 absolute">Máx. Histórico</span>
                </div>
                <div className="absolute w-full border-t border-dashed border-yellow-500" style={{ bottom: `${(lastYearMax / overallMax) * 100}%` }}>
                    <span className="text-xs text-yellow-600 bg-gray-50 px-1 -mt-2 absolute">Máx. Año Pasado</span>
                </div>
                
                {/* Barras de volumen */}
                {current.map((value, index) => (
                    <div 
                        key={index}
                        className="flex-grow bg-blue-400 hover:bg-blue-600 rounded-t-sm"
                        style={{ height: `${(value / overallMax) * 100}%` }}
                        title={`Semana ${index + 1}: ${value}`}
                    />
                ))}
            </div>
        </div>
    );
}