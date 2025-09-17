import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import InputField from '../common/InputField'; // Importamos el componente InputField

export default function QualificationModal({ onClose, onSave, qualificationToEdit }) {
    const { state } = useData();
    const { sgrs } = state; // Obtenemos la lista de SGRs/Entidades del estado global

    const getInitialData = () => ({
        name: '',
        type: 'SGR',
        lineAmount: 0,
        destination: '',
        lineExpiryDate: new Date().toISOString().split('T')[0],
    });

    const [formData, setFormData] = useState(qualificationToEdit || getInitialData());

    useEffect(() => {
        if (qualificationToEdit) {
            setFormData(qualificationToEdit);
        } else {
            setFormData(getInitialData());
        }
    }, [qualificationToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">{qualificationToEdit ? 'Editar' : 'Añadir'} Línea de Calificación</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Entidad</label>
                        <select 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded-md bg-white mt-1"
                            required
                        >
                            <option value="">-- Seleccionar Entidad --</option>
                            {(sgrs || []).map(sgr => (<option key={sgr.id} value={sgr.name}>{sgr.name}</option>))}
                        </select>
                    </div>

                    <InputField label="Monto Asignado" name="lineAmount" type="number" value={formData.lineAmount} onChange={handleChange} required />
                    <InputField label="Destino" name="destination" value={formData.destination} onChange={handleChange} />
                    <InputField label="Vencimiento" name="lineExpiryDate" type="date" value={formData.lineExpiryDate ? new Date(formData.lineExpiryDate).toISOString().split('T')[0] : ''} onChange={handleChange} required />
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type-="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}