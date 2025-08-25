import React from 'react';
import { X, Calendar, User, Info } from 'lucide-react';

export default function TaskDetailModal({ task, onClose }) {
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={28} />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
                <div className="mt-4 space-y-3">
                    <div className="flex items-center text-gray-600"><User size={16} className="mr-2"/> <span>Cliente: <strong>{task.clientName || 'General'}</strong></span></div>
                    <div className="flex items-center text-gray-600"><Calendar size={16} className="mr-2"/> <span>Vence: <strong>{new Date(task.dueDate + 'T00:00:00').toLocaleDateString('es-AR', {timeZone: 'UTC'})}</strong></span></div>
                    {task.details && <div className="flex items-start text-gray-700 bg-gray-100 p-3 rounded-md"><Info size={16} className="mr-3 mt-0.5 flex-shrink-0" /><p>{task.details}</p></div>}
                </div>
            </div>
        </div>
    );
}