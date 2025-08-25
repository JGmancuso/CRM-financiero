import React, { useState } from 'react';
import { Search, ArrowRight, XCircle } from 'lucide-react';

// Simulación de una consulta a la API de deudores
const fakeCheckCuit = (cuit) => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (cuit.includes('7')) {
                resolve({ status: 'Riesgo Alto', message: 'El cliente presenta multiples deudas en sistema.' });
            } else {
                resolve({ status: 'Normal', message: 'El cliente no presenta una situación de riesgo.' });
            }
        }, 1000);
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Consulta Rápida de Deudor</h2>
            <p className="text-gray-500 mb-6">Ingresa el CUIT para un análisis previo.</p>
            
            <div className="flex justify-center max-w-sm mx-auto">
                <input
                    type="text"
                    value={cuit}
                    onChange={(e) => setCuit(e.target.value)}
                    placeholder="Ingresa CUIT sin guiones"
                    className="w-full px-4 py-2 border rounded-l-lg"
                    disabled={isLoading || result}
                />
                <button onClick={handleCheck} disabled={isLoading || result} className="bg-blue-600 text-white p-3 rounded-r-lg">
                    {isLoading ? '...' : <Search size={20} />}
                </button>
            </div>

            {result && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg animate-fade-in">
                    <h3 className="font-semibold">Resultado del Análisis:</h3>
                    <p className={`font-bold my-2 ${result.status === 'Normal' ? 'text-green-600' : 'text-red-600'}`}>
                        {result.status}
                    </p>
                    <p className="text-sm text-gray-600">{result.message}</p>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button onClick={onCancel} className="flex items-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg"><XCircle size={16} className="mr-2"/> Descartar</button>
                        <button onClick={() => onProceed(cuit)} className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg"><ArrowRight size={16} className="mr-2"/> Avanzar con la Carga</button>
                    </div>
                </div>
            )}
        </div>
    );
}