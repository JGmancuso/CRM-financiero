import React from 'react';
import { PlusCircle, Paperclip, Link as LinkIcon } from 'lucide-react';

export default function DocumentsTab({ client, onAddDocument, onViewDocument }) {
    const documents = client.documents || [];
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Documentación Adjunta</h3>
                <button onClick={onAddDocument} className="bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition text-sm flex items-center">
                    <PlusCircle size={16} className="mr-2" /> Agregar Documento
                </button>
            </div>
            <div className="space-y-3">
                {documents.length > 0 ? documents.map(doc => (
                    <button key={doc.id} onClick={() => onViewDocument(doc)} className="w-full text-left bg-gray-50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-100 transition">
                        <div className="flex items-center">
                            {doc.type === 'link' ? <LinkIcon className="text-blue-500 mr-3" /> : <Paperclip className="text-gray-500 mr-3" />}
                            <div>
                                <p className="font-semibold text-gray-800">{doc.name}</p>
                                <p className="text-sm text-gray-500">Categoría: {doc.category}</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">Agregado: {new Date(doc.uploadDate).toLocaleDateString('es-AR')}</span>
                    </button>
                )) : (
                    <div className="text-center text-gray-400 py-6">No hay documentos adjuntos.</div>
                )}
            </div>
        </div>
    );
}