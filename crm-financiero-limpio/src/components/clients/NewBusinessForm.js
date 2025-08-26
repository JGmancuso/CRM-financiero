// src/components/clients/NewBusinessForm.js

import React, { useState } from 'react';

export default function NewBusinessForm({ onSave, onCancel }) {
    const [formData, setFormData] = useState({
        motivo: '',
        montoAproximado: '',
        observaciones: ''
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">Motivo del Negocio</label>
                <input type="text" name="motivo" value={formData.motivo} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
                <label htmlFor="montoAproximado" className="block text-sm font-medium text-gray-700">Monto Aproximado</label>
                <input type="number" name="montoAproximado" value={formData.montoAproximado} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
             <div>
                <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">Observaciones</label>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Crear Negocio</button>
            </div>
        </form>
    );
}