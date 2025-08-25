import React, { useState, useEffect } from 'react';
import InputField from '../common/InputField';

export default function ActivityModal({ onClose, onSave, activityToEdit }) {
    
    // El estado inicial ahora usa la estructura estándar
    const getInitialState = () => ({
        title: '',
        dueDate: new Date().toISOString().split('T')[0],
        details: '',
        isCompleted: false
    });

    const [formData, setFormData] = useState(getInitialState());
    
    // Este useEffect ahora mapea correctamente los datos de la tarea a editar al formulario
    useEffect(() => {
        if (activityToEdit && activityToEdit.id) {
            setFormData({
                id: activityToEdit.id,
                title: activityToEdit.title || '',
                dueDate: activityToEdit.dueDate ? activityToEdit.dueDate.split('T')[0] : getInitialState().dueDate,
                details: activityToEdit.details || '',
                isCompleted: activityToEdit.isCompleted || false
            });
        } else {
            setFormData(getInitialState());
        }
    }, [activityToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.dueDate) {
            alert("Por favor, completa el título y la fecha.");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{activityToEdit && activityToEdit.id ? 'Editar' : 'Nueva'} Tarea/Evento</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField name="title" label="Título" value={formData.title} onChange={handleChange} required />
                    <InputField name="dueDate" label="Fecha" type="date" value={formData.dueDate} onChange={handleChange} required />
                    <InputField name="details" label="Notas / Detalles" value={formData.details} onChange={handleChange} as="textarea" />
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};