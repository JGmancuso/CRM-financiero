import React from 'react';

export default function FunnelStageDetailModal({ stageName, clients, onClose, onClientSelect }) {
    const timeSince = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " años";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " meses";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " días";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " horas";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutos";
        return Math.floor(seconds) + " segundos";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Clientes en: {stageName}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <div className="overflow-x-auto max-h-[60vh]">
                    <table className="min-w-full bg-white border">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Nombre</th>
                                <th className="py-2 px-4 border-b text-left">Fecha de Carga</th>
                                <th className="py-2 px-4 border-b text-left">Última Actualización</th>
                                <th className="py-2 px-4 border-b text-left">Antigüedad en Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">
                                        <button onClick={() => onClientSelect(client)} className="text-blue-600 hover:underline font-semibold">
                                            {client.name}
                                        </button>
                                    </td>
                                    <td className="py-2 px-4 border-b">{new Date(client.creationDate).toLocaleDateString('es-AR')}</td>
                                    <td className="py-2 px-4 border-b">{new Date(client.lastUpdate).toLocaleDateString('es-AR')}</td>
                                    <td className="py-2 px-4 border-b">{timeSince(client.lastUpdate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
