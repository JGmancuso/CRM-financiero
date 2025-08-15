import React from 'react';
import { PlusCircle, Shield } from 'lucide-react';

export default function FinancingTab({ client, onAddInstrument }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Instrumentos de Financiación</h3>
                <button onClick={onAddInstrument} className="bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition text-sm flex items-center"><PlusCircle size={16} className="mr-2" /> Nuevo Instrumento</button>
            </div>
            <div className="space-y-4">
                {(client.financing || []).map(f => (
                    <div key={f.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-gray-800">{f.instrument} <span className="font-normal text-gray-600">- {f.details}</span></p>
                                <p className="text-xl font-semibold text-blue-700">${f.amount.toLocaleString('es-AR')}</p>
                            </div>
                            {f.sgr.isQualified && <div className="text-xs text-right font-bold bg-green-200 text-green-800 py-1 px-3 rounded-full flex items-center"><Shield size={14} className="mr-1.5" /> {client.qualifications.find(q=>q.id === f.sgr.qualificationId)?.name}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}