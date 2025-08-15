import React from 'react';

export default function DocumentViewerModal({ doc, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{doc.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <div className="bg-gray-100 p-8 text-center rounded-md">
                    <p className="text-gray-600">Simulación de vista previa del documento.</p>
                    <p className="font-mono mt-2">{doc.name}</p>
                </div>
            </div>
        </div>
    );
}