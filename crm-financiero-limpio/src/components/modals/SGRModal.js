import React, { useState, useEffect } from 'react';
import InputField from '../common/InputField';
import { ENTITY_TYPES } from '../../data'; // <-- 1. Importamos los tipos de entidad

export default function SGRModal({ onClose, onSave, existingSGR }) {
    // 2. Añadimos el campo 'type' al estado inicial por defecto
    const [formData, setFormData] = useState(
        existingSGR || { name: '', totalQuota: 0, type: 'SGR' }
    );
    
    // El useEffect se encarga de rellenar el formulario si estamos editando
    useEffect(() => {
        if (existingSGR) {
            setFormData(existingSGR);
        }
    }, [existingSGR]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-6">{existingSGR ? 'Editar Entidad' : 'Nueva Entidad'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* --- 👇 3. NUEVO CAMPO 'TIPO' AÑADIDO AQUÍ 👇 --- */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Entidad</label>
                        <select 
                            name="type" 
                            id="type"
                            value={formData.type} 
                            onChange={handleChange} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white p-2"
                        >
                            {Object.entries(ENTITY_TYPES).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                    {/* --- 👆 FIN DEL NUEVO CAMPO 👆 --- */}

                    <InputField label="Nombre de la Entidad" name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label="Cupo Total" name="totalQuota" type="number" value={formData.totalQuota} onChange={handleChange} />

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                            {existingSGR ? 'Guardar Cambios' : 'Guardar Entidad'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}