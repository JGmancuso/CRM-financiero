import React from 'react';
import { Shield, Banknote, PlusCircle, Edit } from 'lucide-react';

export default function QualificationsTab({ client, onAddQualification }) {
    const qualifications = client.qualifications || [];
    const today = new Date().toISOString().split('T')[0];

    const calculateUsedAmount = (line) => {
        return (client.financing || [])
            .filter(f => {
                if (!f.sgr.isQualified || f.sgr.qualificationId !== line.id) return false;
                const lastPayment = f.schedule[f.schedule.length - 1];
                return lastPayment.date >= today;
            })
            .reduce((sum, f) => {
                if (f.instrument === 'ON') {
                    return sum + f.schedule.filter(p => p.type === 'Amortización').reduce((subSum, p) => subSum + p.amount, 0);
                }
                return sum + f.amount;
            }, 0);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Líneas de Crédito y Calificaciones</h3>
                <button onClick={() => onAddQualification()} className="bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition text-sm flex items-center">
                    <PlusCircle size={16} className="mr-2" /> Agregar Línea
                </button>
            </div>
            <div className="space-y-4">
                {qualifications.length > 0 ? qualifications.map(line => {
                    const usedAmount = calculateUsedAmount(line);
                    const availableAmount = line.lineAmount - usedAmount;
                    const isExpired = line.lineExpiryDate < today;
                    const percentageUsed = line.lineAmount > 0 ? (usedAmount / line.lineAmount) * 100 : 0;

                    return (

			<div key={line.id ?? `${line.name ?? 'no-name'}-${line.lineAmount ?? '0'}-${Math.random()}`} className="...">

                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-800 flex items-center">
                                    {line.type === 'SGR' ? <Shield size={18} className="mr-2 text-green-600" /> : <Banknote size={18} className="mr-2 text-purple-600" />}
                                    {line.name}
                                </h4>
                                <div className="flex items-center space-x-2">
                                    {isExpired && <span className="text-xs font-bold bg-red-200 text-red-800 py-1 px-2 rounded-full">VENCIDA</span>}
                                    <button onClick={() => onAddQualification(line)} className="p-1 text-gray-500 hover:text-blue-600"><Edit size={16} /></button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">Destino: {line.destination || 'No especificado'}</p>
                            <p className="text-sm text-gray-500">Vencimiento: {new Date(line.lineExpiryDate).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</p>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2.5 my-3">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentageUsed}%` }}></div>
                            </div>

			    <div className="text-sm grid grid-cols-3 gap-2">
  				<span>Utilizado: <span className="font-semibold text-red-600">${(usedAmount ?? 0).toLocaleString('es-AR')}</span></span>
  				<span>Disponible: <span className="font-semibold text-green-600">${(availableAmount ?? 0).toLocaleString('es-AR')}</span></span>
  				<span>Asignado: <span className="font-semibold">${(line.lineAmount ?? 0).toLocaleString('es-AR')}</span></span>
			    </div>


                        </div>
                    );
                }) : (
                    <div className="text-center text-gray-400 py-6">Este cliente no tiene líneas de calificación SGR o bancarias.</div>
                )}
            </div>
        </div>
    );
}