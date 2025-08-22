import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function InvestmentProfileModal({ investment, onClose, onSave }) {
    const [profile, setProfile] = useState(investment.profile || 'Conservador');
    const [currency, setCurrency] = useState(investment.currency || 'ARS');
    const [broker, setBroker] = useState(investment.broker || '');

    const handleSaveClick = () => {
        onSave({
            profile,
            currency,
            broker,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Perfil de Inversión</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={28} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="broker" className="block text-sm font-medium text-gray-700 mb-1">
                            ALyC / Banco
                        </label>
                        <input
                            type="text"
                            id="broker"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={broker}
                            onChange={(e) => setBroker(e.target.value)}
                            placeholder="Ej: Balanz Capital, IOL, Banco Galicia"
                        />
                    </div>
                    <div>
                        <label htmlFor="profile" className="block text-sm font-medium text-gray-700 mb-1">
                            Perfil de Riesgo
                        </label>
                        <select
                            id="profile"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={profile}
                            onChange={(e) => setProfile(e.target.value)}
                        >
                            <option>Conservador</option>
                            <option>Moderado</option>
                            <option>Agresivo</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                            Moneda de Operación
                        </label>
                        <select
                            id="currency"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option>ARS</option>
                            <option>USD</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}