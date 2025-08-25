// src/components/debtor-status/DebtEvolutionChart.js

import React from 'react';

const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#6366F1'];

export default function DebtEvolutionChart({ chartData, uniqueBanks, maxTotalDebt }) {
    const bankColors = uniqueBanks.reduce((acc, bank, index) => {
        acc[bank] = colors[index % colors.length];
        return acc;
    }, {});

    return (
        <div>
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mb-4">
                {uniqueBanks.map(bank => (
                    <div key={bank} className="flex items-center text-sm">
                        <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: bankColors[bank] }}></div>
                        <span>{bank}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-end space-x-2 h-64 bg-gray-50 p-4 rounded-lg border">
                {chartData.map(d => (
                    <div key={d.period} className="w-full h-full flex flex-col-reverse relative group">
                        {uniqueBanks.map(bank => (
                            <div 
                                key={bank}
                                className="w-full transition-all"
                                style={{
                                    height: `${(d[bank] / maxTotalDebt) * 100}%`,
                                    backgroundColor: bankColors[bank]
                                }}
                            ></div>
                        ))}
                        {/* --- Tooltip mejorado para mostrar el detalle por banco --- */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <strong>{d.period.substring(4,6)}/{d.period.substring(0,4)}</strong>
                            <hr className="my-1 border-gray-600" />
                            <div className="space-y-1">
                                {uniqueBanks.map(bank => (
                                    <div key={bank} className="flex justify-between items-center space-x-2">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: bankColors[bank] }}></div>
                                            <span>{bank}:</span>
                                        </div>
                                        <span className="font-mono">${(d[bank] || 0).toLocaleString('es-AR')}</span>
                                    </div>
                                ))}
                                <hr className="my-1 border-gray-600" />
                                <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span className="font-mono">${(d.total).toLocaleString('es-AR')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <div className="flex text-xs text-gray-500 mt-1">
                {chartData.map(d => (
                    <div key={d.period} className="w-full text-center">{d.period.substring(4,6)}/{d.period.substring(2,4)}</div>
                ))}
            </div>
        </div>
    );
}