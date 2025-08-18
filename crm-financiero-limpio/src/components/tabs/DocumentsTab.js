// src/components/tabs/DocumentsTab.js

import React from 'react';
import { Paperclip, Link as LinkIcon } from 'lucide-react';
import DocumentUploader from '../clients/DocumentUploader';

export default function DocumentsTab({ client, onViewDocument, documentRequirements, onAddDocument }) {
    // Esta línea ya previene el error. Si client.documents es undefined, usa un array vacío. ¡Excelente!
    const documents = client.documents || [];
    
    return (
        <div>
            <DocumentUploader 
                documentRequirements={documentRequirements}
                onSave={onAddDocument}
                clientId={client.id}
            />

            <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Documentos Cargados</h3>
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