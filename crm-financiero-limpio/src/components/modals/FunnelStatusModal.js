import React, { useState } from 'react';
import InputField from '../common/InputField';

export default function FunnelStatusModal({ client, newStatus, onClose, onSave }) {
    const [formData, setFormData] = useState({
        reason: '',
        nextSteps: '',
        missingItems: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-2">Actualizar Estado</h2>
                <p className="text-gray-600 mb-6">Moviendo a <span className="font-semibold text-blue-600">{client.name}</span> al estado <span className="font-semibold text-blue-600">"{newStatus}"</span>.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Motivo del Contacto / Cambio" name="reason" value={formData.reason} onChange={handleChange} />
                    <InputField label="Pasos a Seguir (generará una tarea)" name="nextSteps" value={formData.nextSteps} onChange={handleChange} />
                    <InputField label="Faltantes a Solicitar (generará una tarea)" name="missingItems" value={formData.missingItems} onChange={handleChange} />
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar y Generar Tareas</button>
                    </div>
                </form>
            </div>
        </div>
    );
}



