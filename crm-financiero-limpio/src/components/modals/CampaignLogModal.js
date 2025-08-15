import React, { useState } from 'react';
import InputField from '../common/InputField';

export default function CampaignLogModal({ client, campaign, onClose, onSave }) {
    const [logData, setLogData] = useState({
        contacted: 'Sí',
        response: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLogData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(logData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-2">Registrar Contacto de Campaña</h2>
                <p className="text-gray-600 mb-6">Cliente: <span className="font-semibold">{client.name}</span> | Campaña: <span className="font-semibold">{campaign.name}</span></p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="¿Fue contactado?" name="contacted" value={logData.contacted} onChange={handleChange} select>
                        <option>Sí</option>
                        <option>No</option>
                    </InputField>
                    <InputField label="Respuesta / Notas" name="response" value={logData.response} onChange={handleChange} />
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar Registro</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
