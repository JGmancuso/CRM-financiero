import React from 'react';

export default function EventDetailModal({ event, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold mb-4">{event.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 -mt-2 -mr-2">&times;</button>
                </div>
                <p className="text-sm text-gray-500 mb-2">Cliente: <span className="font-semibold text-gray-700">{event.clientName}</span></p>
                <p className="text-sm text-gray-500 mb-4">Hora: <span className="font-semibold text-gray-700">{new Date(event.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span></p>
                <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="font-semibold text-gray-600 mb-1">Notas:</h3>
                    <p className="text-gray-800">{event.note || 'No hay notas para este evento.'}</p>
                </div>
            </div>
        </div>
    );
}