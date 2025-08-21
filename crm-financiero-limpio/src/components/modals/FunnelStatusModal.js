import React, { useState } from 'react';
import InputField from '../common/InputField';

export default function FunnelStatusModal({ negocio, newStatus, onClose, onSave }) {
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
        // onSave solo necesita devolver los datos del formulario.
        // El hook useFunnel ya sabe qué negocio se está actualizando.
        onSave(formData);
    };

    // Verificación para asegurarnos de que tenemos los datos antes de renderizar
    if (!negocio) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-2">Actualizar Etapa del Negocio</h2>
                
                {/* Aquí mostramos la información que "cargamos" en el modal */}
                <div className="text-gray-600 mb-6 p-3 bg-gray-50 rounded-md border">
                    <p>
                        Moviendo el negocio 
                        <span className="font-semibold text-blue-600"> "{negocio.nombre}"</span>
                    </p>
                    <p className="text-sm">
                        Cliente: 
                        <span className="font-semibold text-gray-800"> {negocio.cliente.nombre}</span>
                    </p>
                    <p className="mt-1">
                        A la etapa: 
                        <span className="font-semibold text-blue-600"> "{newStatus}"</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Motivo del Cambio" name="reason" value={formData.reason} onChange={handleChange} required />
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


