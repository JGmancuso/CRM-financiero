import React, { useState } from 'react';
import InputField from '../common/InputField';

export default function QualificationModal({ onClose, onSave, qualificationToEdit, sgrs }) {
    const [qualification, setQualification] = useState(qualificationToEdit || {
        type: 'SGR', name: sgrs[0]?.name || '', lineAmount: 0, lineExpiryDate: '', destination: ''
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) || 0 : value;
        
        const newQualification = {...qualification, [name]: val};
        if (name === 'type' && val === 'SGR') {
            newQualification.name = sgrs[0]?.name || '';
        } else if (name === 'type' && val === 'Banco') {
            newQualification.name = '';
        }
        setQualification(newQualification);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(qualification);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-6">{qualificationToEdit ? 'Editar' : 'Nueva'} Línea de Calificación</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Tipo" name="type" value={qualification.type} onChange={handleChange} select>
                            <option>SGR</option>
                            <option>Banco</option>
                        </InputField>
                        {qualification.type === 'SGR' ? (
                            <InputField label="Nombre SGR" name="name" value={qualification.name} onChange={handleChange} select>
                                {sgrs.map(s => <option key={s.id}>{s.name}</option>)}
                            </InputField>
                        ) : (
                            <InputField label="Nombre Banco" name="name" value={qualification.name} onChange={handleChange} />
                        )}
                    </div>
                    <InputField label="Destino" name="destination" value={qualification.destination} onChange={handleChange} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Monto de la Línea" name="lineAmount" type="number" value={qualification.lineAmount} onChange={handleChange} />
                        <InputField label="Vencimiento de la Línea" name="lineExpiryDate" type="date" value={qualification.lineExpiryDate} onChange={handleChange} />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar Línea</button>
                    </div>
                </form>
            </div>
        </div>
    );
}