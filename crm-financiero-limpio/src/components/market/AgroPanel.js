import React from 'react';
import TrendChart from '../charts/TrendChart'; // <-- AÑADE ESTA LÍNEA DE IMPORTACIÓN
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <ArrowUp className="text-green-500" size={16} />;
    if (trend === 'down') return <ArrowDown className="text-red-500" size={16} />;
    return <Minus className="text-gray-500" size={16} />;
};

export default function AgroPanel({ data }) {
    // Añadimos una verificación para evitar errores si los datos no están listos
    if (!data || !data.grains || !data.impliedRates) {
        return (
             <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg">Agro</h3>
                <p className="text-sm text-gray-500">Cargando datos...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-4">Agro</h3>
            <div className="space-y-3">
                {data.grains.map(grain => (
                    <div key={grain.name} className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{grain.name}</p>
                            <p className="text-sm text-gray-500">{grain.cycle}</p>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold text-lg mr-2">${grain.price}</span>
                            <TrendIcon trend={grain.trend} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="space-y-3 pt-4 mt-4 border-t">
                <h4 className="font-semibold text-sm">Tasas Implícitas Futuros</h4>
                <div>
                    <span className="text-xs font-bold text-yellow-600">SOJA</span>
                    <TrendChart data={data.impliedRates.soja} color="#D97706" />
                </div>
                <div>
                    <span className="text-xs font-bold text-green-600">MAÍZ</span>
                    <TrendChart data={data.impliedRates.maiz} color="#059669" />
                </div>
            </div>
        </div>
    );
}