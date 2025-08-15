import React, { useState } from 'react';
import InputField from '../common/InputField';

export default function SGRModal({ onClose, onSave }) {
    const [sgr, setSgr] = useState({ name: '', totalQuota: 0 });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setSgr(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(sgr);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-6">Nueva SGR</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Nombre de la SGR" name="name" value={sgr.name} onChange={handleChange} required />
                    <InputField label="Cupo Total" name="totalQuota" type="number" value={sgr.totalQuota} onChange={handleChange} required />
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar SGR</button>
                    </div>
                </form>
            </div>
        </div>
    );
}