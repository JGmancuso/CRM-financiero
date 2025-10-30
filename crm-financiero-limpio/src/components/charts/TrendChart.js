// src/components/charts/TrendChart.js
import React from 'react';

// Un componente simple para dibujar una línea de tendencia con SVG
export default function TrendChart({ data, color = "#4A90E2" }) {
    if (!data || data.length < 2) return null;
    const points = data.map((d, i) => `${i * 30},${40 - (d / 2)}`).join(' ');
    
    return (
        <svg viewBox="0 0 100 40" className="w-full h-10">
            <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
        </svg>
    );
}