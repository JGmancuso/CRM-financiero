import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import Accordion from '../common/Accordion';

const getStatusColor = (status) => {
    const colors = ['bg-gray-300', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500'];
    return colors[status] || colors[0];
};

export default function CuitQuickCheck({ onConvertToClient }) {
    const [cuit, setCuit] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    // Esta función limpia la búsqueda actual para permitir una nueva.
    const handleReset = () => {
        setCuit('');
        setData(null);
        setError(null);
    };

    // Aquí iría tu lógica de 'handleCheck' para conectar a la API del BCRA
    const handleCheck = async () => {
        // ... tu lógica de fetch a la API del BCRA va aquí ...
        // Por ahora, usamos una simulación para evitar errores de conexión:
        setIsLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulación de una respuesta exitosa
        setData({
            totalDebt: 125000,
            currentSituation: [{ entidad: 'Banco Galicia', situacion: 1, monto: 125000 }],
            history: [],
            rejectedChecks: []
        });
        setIsLoading(false);
    };

    const isRisky = data && (data.rejectedChecks.length > 0 || data.currentSituation.some(s => s.situacion > 1));

    return (
        <div className="p-6 bg-white shadow-xl rounded-2xl max-w-4xl mx-auto">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Panel de Consulta Crediticia</h2>
                <p className="text-gray-500 mb-6">Ingresa un CUIT para obtener un reporte completo de la situación deudora.</p>
            </div>
            
            <div className="flex justify-center max-w-sm mx-auto">
                <input
                    type="text" value={cuit} onChange={(e) => setCuit(e.target.value)}
                    placeholder="Ingresa CUIT sin guiones"
                    className="w-full px-4 py-2 border rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading || !!data}
                />
                <button onClick={handleCheck} disabled={isLoading || !!data} className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400">
                    {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Search size={20} />}
                </button>
            </div>

            {error && <p className="text-center text-red-600 mt-4 p-4 bg-red-50 rounded-lg">{error}</p>}

            {data && (
                <div className="mt-8 animate-fade-in text-left">
                    <div className={`p-4 rounded-lg mb-6 text-center ${isRisky ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                        <h3 className="font-bold text-lg">{isRisky ? 'Se detectó Riesgo Potencial' : 'Situación Crediticia Normal'}</h3>
                    </div>
                    
                    <div className="space-y-2">
                        {/* Aquí irían tus componentes <Accordion> para mostrar los detalles */}
                        <Accordion title="Resumen General" startOpen={true}>
                           <p>Deuda Total: ${data.totalDebt.toLocaleString('es-AR')}</p>
                        </Accordion>
                    </div>

                    <div className="mt-8 pt-6 border-t flex justify-center space-x-4">
                        <button 
                            onClick={handleReset} 
                            className="flex items-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                            <Search size={16} className="mr-2"/> Nueva Consulta
                        </button>
                        <button 
                            onClick={() => onConvertToClient(cuit)} 
                            className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">
                            <ArrowRight size={16} className="mr-2"/> Pasar a Cliente Nuevo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}