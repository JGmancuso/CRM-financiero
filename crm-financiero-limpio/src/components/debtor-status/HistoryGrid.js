// src/components/debtor-status/HistoryGrid.js

import React from 'react';
import { getStatusColor } from '../../services/bcraService'; // Importa la función de colores

export default function HistoryGrid({ uniquePeriods, uniqueBanks, situationGrid }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="py-2 px-3 border text-left font-semibold text-gray-600">Entidad</th>
                        {uniquePeriods.map(period => (
                            <th key={period} className="py-2 px-3 border font-semibold text-gray-600 w-20">
                                {period.substring(4, 6)}/{period.substring(0, 4)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {uniqueBanks.map(bank => (
                        <tr key={bank} className="hover:bg-gray-50">
                            <td className="py-2 px-3 border font-semibold">{bank}</td>
                            {uniquePeriods.map(period => (
                                <td key={period} className="border text-center">
                                    {situationGrid[bank][period] ? (
                                        <div 
                                            className={`w-5 h-5 rounded-full mx-auto ${getStatusColor(situationGrid[bank][period])}`} 
                                            title={`Situación: ${situationGrid[bank][period]}`}
                                        ></div>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}