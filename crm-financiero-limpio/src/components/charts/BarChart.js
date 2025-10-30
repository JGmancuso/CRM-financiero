// src/components/charts/BarChart.js
import React from 'react';

// Un componente simple para una barra de comparación
export default function BarChart({ value, total, color = "bg-blue-500", label }) {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <span className="text-xs font-semibold">{label}</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div className={color} style={{ width: `${percentage}%`, height: '100%', borderRadius: '9999px' }}></div>
            </div>
        </div>
    );
}