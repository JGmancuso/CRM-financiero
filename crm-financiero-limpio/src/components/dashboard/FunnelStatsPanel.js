import React, { useMemo } from 'react';
import { FUNNEL_STAGES } from '../../data';

export default function FunnelStatsPanel({ negocios, onStageClick }) {

    const funnelStats = useMemo(() => {
        const counts = {};
        for (const key in FUNNEL_STAGES) {
            counts[FUNNEL_STAGES[key]] = 0;
        }
        (negocios || []).forEach(negocio => {
            const stageName = FUNNEL_STAGES[negocio.estado];
            if (stageName) {
                counts[stageName]++;
            }
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count }));
    }, [negocios]);

    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Embudo de Negocios</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {funnelStats.map(stage => (
                    <button 
                        key={stage.name} 
                        onClick={() => onStageClick(stage.name)} 
                        className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center hover:bg-blue-100 transition"
                    >
                        <p className="text-3xl font-bold text-blue-700">{stage.count}</p>
                        <p className="text-sm font-medium text-blue-600">{stage.name}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}