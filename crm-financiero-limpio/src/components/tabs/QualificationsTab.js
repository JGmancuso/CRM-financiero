import React, { useState } from 'react';
import { Shield, Banknote, PlusCircle, Edit, DollarSign, Target, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function QualificationsTab({ client }) {
    const { dispatch } = useData();
    
    console.log("PASO 3 (Visualización): La pestaña de calificaciones está recibiendo este cliente:", client);
    console.log("PASO 3.1: Las calificaciones a mostrar son:", client.qualifications);

    const qualifications = client.qualifications || [];
    const today = new Date().toISOString().split('T')[0];

    const handleOpenModal = (qual = null) => {
        alert("La funcionalidad para añadir/editar líneas manualmente se conectará aquí.");
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Líneas de Crédito y Calificaciones Aprobadas</h3>
                <button onClick={() => handleOpenModal()} className="bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 text-sm flex items-center">
                    <PlusCircle size={16} className="mr-2" /> Agregar Línea Manualmente
                </button>
            </div>
            <div className="space-y-4">
                {qualifications.length > 0 ? qualifications.map(line => {
                    const isExpired = line.lineExpiryDate < today;
                    return (
                        <div key={line.id} className={`p-4 rounded-lg border-l-4 ${isExpired ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-500'}`}>
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-800 flex items-center">
                                    <Shield size={18} className="mr-2 text-green-600" />
                                    {line.name}
                                </h4>
                                <button onClick={() => handleOpenModal(line)} className="p-1 text-gray-500 hover:text-blue-600"><Edit size={16} /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                                <div className="flex items-center">
                                    <DollarSign size={14} className="mr-2 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Monto Aprobado</p>
                                        <p className="font-semibold text-gray-800">{(line.lineAmount || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Target size={14} className="mr-2 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Destino</p>
                                        <p className="font-semibold text-gray-800">{line.destination || 'No especificado'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Calendar size={14} className="mr-2 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Vencimiento</p>
                                        <p className="font-semibold text-gray-800">{new Date(line.lineExpiryDate + 'T00:00:00').toLocaleDateString('es-AR')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center text-gray-400 py-6">Este cliente no tiene líneas de calificación aprobadas.</div>
                )}
            </div>
        </div>
    );
}