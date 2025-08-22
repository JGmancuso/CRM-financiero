import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function StageChangeModal({ negocio, newStatusName, onClose, onSave }) {
    // Estado interno para manejar los campos del formulario
    const [motivo, setMotivo] = useState('');
    const [proximosPasos, setProximosPasos] = useState('');
    const [faltantes, setFaltantes] = useState('');

    const handleSaveClick = () => {
        if (!motivo) {
            alert('Por favor, completa el motivo del cambio.');
            return;
        }
        // Creamos el objeto formData que enviaremos al hook
        const formData = {
            motivo,
            proximosPasos,
            faltantes
        };
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Actualizar Negocio</h2>
                        <p className="text-gray-500">
                            Moviendo a <span className="font-semibold text-blue-600">{newStatusName}</span> para {negocio.cliente.nombre}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={28} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
                            Motivo del Cambio / Observaciones <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="motivo"
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Ej: Cliente entregó la documentación inicial..."
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="proximosPasos" className="block text-sm font-medium text-gray-700 mb-1">
                            Próximos Pasos a Seguir
                        </label>
                        <input
                            type="text"
                            id="proximosPasos"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={proximosPasos}
                            onChange={(e) => setProximosPasos(e.target.value)}
                            placeholder="Ej: Iniciar análisis de riesgo crediticio"
                        />
                    </div>
                    <div>
                        <label htmlFor="faltantes" className="block text-sm font-medium text-gray-700 mb-1">
                            Información o Documentación Faltante
                        </label>
                        <input
                            type="text"
                            id="faltantes"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={faltantes}
                            onChange={(e) => setFaltantes(e.target.value)}
                            placeholder="Ej: Falta presentar el último balance"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSaveClick}
                        className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition"
                    >
                        Guardar y Actualizar
                    </button>
                </div>
            </div>
        </div>
    );
}