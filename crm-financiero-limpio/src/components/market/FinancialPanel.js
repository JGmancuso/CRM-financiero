
import TrendChart from '../charts/TrendChart';
import { ArrowUp, ArrowDown } from 'lucide-react';

import React, { useState } from 'react';
// ... (imports)

export default function FinancialPanel({ data }) {
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });

    // Verificación robusta: si alguna parte de los datos falta, no se rompe.
    if (!data || !data.dolar || !data.impliedRates) {
        return <div>Cargando datos financieros...</div>;
    }

    const handleMouseOver = (e, curveName, point) => {
        setTooltip({
            show: true,
            x: e.clientX,
            y: e.clientY,
            content: `${curveName} (${point.period}): ${point.value}%`
        });
    };
    const handleMouseOut = () => setTooltip({ show: false });

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h3 className="font-bold text-lg">Financiero</h3>
            <div className="flex justify-between items-center text-2xl font-bold">
                <span>Dólar</span>
                <span className="flex items-center">
                    ${data.dolar.value.toFixed(2)}
                    {data.dolar.trend === 'up' ? <ArrowUp className="text-green-500 ml-2" /> : <ArrowDown className="text-red-500 ml-2" />}
                </span>
            </div>
            <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-sm">Tasas Implícitas (Curva)</h4>
                <div>
                    <span className="text-xs font-bold text-blue-600">ROFEX</span>
                    <TrendChart data={data.impliedRates.rofex} color="#3B82F6" />
                </div>
                <div>
                    <span className="text-xs font-bold text-green-600">BONOS CER</span>
                    <TrendChart data={data.impliedRates.cer} color="#10B981" />
                </div>
                 <div>
                    <span className="text-xs font-bold text-purple-600">LECAPS</span>
                    <TrendChart data={data.impliedRates.lecap} color="#8B5CF6" />
                </div>
            </div>
        </div>
    );
}