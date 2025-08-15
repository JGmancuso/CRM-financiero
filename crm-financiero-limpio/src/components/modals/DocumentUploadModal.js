import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import InputField from '../common/InputField';

export default function DocumentUploadModal({ onClose, onSave }) {
    const [docType, setDocType] = useState('file');
    const [file, setFile] = useState(null);
    const [link, setLink] = useState('');
    const [category, setCategory] = useState('');

    const handleSave = () => {
        const commonData = {
            id: `d${Date.now()}`,
            category,
            uploadDate: new Date().toISOString().split('T')[0]
        };

        if (docType === 'file' && file && category) {
            onSave({ ...commonData, type: 'file', name: file.name });
            onClose();
        } else if (docType === 'link' && link && category) {
            onSave({ ...commonData, type: 'link', name: `Enlace - ${category}`, url: link });
            onClose();
        } else {
            alert("Por favor, completa todos los campos.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Agregar Documento</h2>
                <div className="space-y-4">
                    <div className="flex rounded-md shadow-sm">
                        <button type="button" onClick={() => setDocType('file')} className={`px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${docType === 'file' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Subir Archivo</button>
                        <button type="button" onClick={() => setDocType('link')} className={`-ml-px px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${docType === 'link' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Agregar Enlace</button>
                    </div>
                    <InputField label="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: Balances, Legales..." />
                    {docType === 'file' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Archivo</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Seleccionar un archivo</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setFile(e.target.files[0])} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">{file ? file.name : 'PNG, JPG, PDF hasta 10MB'}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <InputField label="URL de Google Drive" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://docs.google.com/..." />
                    )}
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button type="button" onClick={handleSave} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar</button>
                </div>
            </div>
        </div>
    );
}