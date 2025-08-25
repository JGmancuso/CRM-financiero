import React, { useState } from 'react';
import InputField from '../common/InputField';

export default function NewBusinessModal({ client, onSave, onClose }) {
    const [businessData, setBusinessData] = useState({
        motivo: '',
        montoAproximado: '',
        observaciones: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'montoAproximado' ? (value === '' ? '' : parseFloat(value)) : value;
        setBusinessData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = () => {
        if (!businessData.motivo) {
            alert('El motivo es obligatorio.');
            return;
        }
        const dataToSave = {
            ...businessData,
            montoAproximado: Number(businessData.montoAproximado) || 0
        };
        onSave(client.id, dataToSave);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Nuevo Negocio para {client.nombre || client.name}</h2>
                <div className="space-y-4">
                    <InputField name="motivo" label="Motivo del Nuevo Negocio" value={businessData.motivo} onChange={handleChange} required />
                    <InputField name="montoAproximado" label="Monto Aproximado" type="number" value={businessData.montoAproximado} onChange={handleChange} />
                    <InputField name="observaciones" label="Observaciones Iniciales" value={businessData.observaciones} onChange={handleChange} as="textarea" />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Crear Negocio</button>
                </div>
            </div>
        </div>
    );
};