import React, { useState } from 'react';
import { Search, ArrowRight, XCircle, AlertTriangle } from 'lucide-react';

// Simulación de una consulta a la API de deudores
const fakeCheckCuit = (cuit) => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (cuit.includes('7')) {
                resolve({
                    status: 'Riesgo Alto',
                    message: 'El cliente presenta deudas con múltiples entidades y cheques rechazados.',
                    totalDebt: 1500000,
                    rejectedChecks: 5,
                    lastCheckDate: '2025-07-15'
                });
            } else {
                resolve({
                    status: 'Normal',
                    message: 'El cliente no presenta una situación de riesgo crediticio significativa.',
                    totalDebt: 0,
                    rejectedChecks: 0,
                    lastCheckDate: '2025-08-22'
                });
            }
        }, 1200);
    });
};

export default function CuitQuickCheck({ onProceed, onCancel }) {
    const [cuit, setCuit] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleCheck = async () => {
        if (cuit.length < 11) {
            alert('Por favor, ingresa un CUIT válido.');
            return;
        }
        setIsLoading(true);
        const checkResult = await fakeCheckCuit(cuit);
        setResult(checkResult);
        setIsLoading(false);
    };

    return (
        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Consulta Rápida de Situación Deudora</h2>
            <p className="text-gray-500 mb-6">Ingresa el CUIT para un análisis crediticio previo.</p>
            
            <div className="flex justify-center max-w-sm mx-auto">
                <input
                    type="text" value={cuit} onChange={(e) => setCuit(e.target.value)}
                    placeholder="Ingresa CUIT sin guiones"
                    className="w-full px-4 py-2 border rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading || result}
                />
                <button onClick={handleCheck} disabled={isLoading || result} className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400">
                    {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Search size={20} />}
                </button>
            </div>

            {result && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg animate-fade-in text-left max-w-lg mx-auto">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Resultado del Análisis</h3>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${result.status === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {result.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{result.message}</p>
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Deuda Total</p>
                            <p className="font-bold text-lg">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(result.totalDebt)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Cheques Rechazados</p>
                            <p className="font-bold text-lg">{result.rejectedChecks}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button onClick={onCancel} className="flex items-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"><XCircle size={16} className="mr-2"/> Descartar</button>
                        <button onClick={() => onProceed(cuit)} className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"><ArrowRight size={16} className="mr-2"/> Avanzar con la Carga</button>
                    </div>
                </div>
            )}
        </div>
    );
}