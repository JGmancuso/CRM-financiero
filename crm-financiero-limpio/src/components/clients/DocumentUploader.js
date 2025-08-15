// src/components/clients/DocumentUploader.js

import React, { useState } from 'react';
import { UploadCloud, FilePlus, AlertCircle } from 'lucide-react';

export default function DocumentUploader({ documentRequirements, onSave, clientId }) {
    const [selectedRequirement, setSelectedRequirement] = useState('');
    const [otherDescription, setOtherDescription] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!file) {
            setError('Por favor, selecciona un archivo para subir.');
            return;
        }

        const isOther = selectedRequirement === 'Otro...';
        if (!selectedRequirement || (isOther && !otherDescription.trim())) {
            setError('Por favor, selecciona un tipo de documento o describe el tipo "Otro".');
            return;
        }

        const newDocument = {
            type: 'file', // O podrías tener lógica para detectar links
            name: file.name,
            category: isOther ? otherDescription.trim() : selectedRequirement,
            file: file, // El archivo en sí
        };

        onSave(clientId, newDocument);

        // Resetear formulario
        setSelectedRequirement('');
        setOtherDescription('');
        setFile(null);
        setError('');
        document.getElementById(`file-input-${clientId}`).value = null;
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-dashed mb-6">
            <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Cargar Nuevo Documento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Columna 1: Desplegable y campo "Otro" */}
                    <div className="space-y-4">
                        <select
                            value={selectedRequirement}
                            onChange={(e) => setSelectedRequirement(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Selecciona un tipo de requisito...</option>
                            {documentRequirements.map(req => (
                                <option key={req} value={req}>{req}</option>
                            ))}
                            <option value="Otro...">Otro...</option>
                        </select>

                        {selectedRequirement === 'Otro...' && (
                            <input
                                type="text"
                                value={otherDescription}
                                onChange={(e) => setOtherDescription(e.target.value)}
                                placeholder="Describe el documento"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 animate-fade-in"
                            />
                        )}
                    </div>
                    {/* Columna 2: Input de archivo y botón de carga */}
                    <div className="flex flex-col justify-between">
                         <input
                            id={`file-input-${clientId}`}
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                        <button type="submit" className="mt-2 md:mt-0 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                            <UploadCloud size={18} className="mr-2"/> Cargar Documento
                        </button>
                    </div>
                </div>
                {error && (
                    <p className="mt-3 text-sm text-red-600 flex items-center">
                        <AlertCircle size={16} className="mr-2"/> {error}
                    </p>
                )}
            </form>
        </div>
    );
}