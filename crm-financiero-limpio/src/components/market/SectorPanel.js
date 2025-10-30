import React from 'react';
import WeeklyVolumeChart from '../charts/WeeklyVolumeChart'; // <-- Añadimos la importación
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function SectorPanel({ data }) {
    if (!data || !data.sectors) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg">Análisis de Sectores</h3>
                <p className="text-sm text-gray-500">Cargando datos...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="font-bold text-lg mb-4">Análisis de Sectores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.sectors.map(sector => (
                    <div key={sector.name}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-gray-800">{sector.name}</span>
                            <div className="flex items-center text-xs font-semibold">
                                {sector.volumeChange > 0 ? <TrendingUp size={14} className="text-green-500 mr-1"/> : <TrendingDown size={14} className="text-red-500 mr-1"/>}
                                Vol: {(sector.volume || 0).toLocaleString('de-DE')}
                            </div>
                        </div>
                        {/* Ahora el componente WeeklyVolumeChart está definido y se puede usar */}
                        <WeeklyVolumeChart data={sector.weeklyVolume} />
                    </div>
                ))}
            </div>
        </div>
    );
}