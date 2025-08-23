import React, { useState, useEffect } from 'react';
import InputField from '../common/InputField';

export default function ActivityModal({ onClose, onSave, activityToEdit }) {
    
    const getInitialState = () => ({
        description: '', // El título de la actividad
        date: new Date().toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
        note: '', // Notas adicionales
        completed: false
    });

    const [activity, setActivity] = useState(activityToEdit || getInitialState());
    
    useEffect(() => {
        if (activityToEdit && activityToEdit.id) {
            const datePart = activityToEdit.date ? activityToEdit.date.split('T')[0] : getInitialState().date;
            setActivity({ ...activityToEdit, date: datePart });
        } else {
            setActivity(getInitialState());
        }
    }, [activityToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivity(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!activity.description || !activity.date) {
            alert("Por favor, completa el título y la fecha.");
            return;
        }
        onSave(activity);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{activityToEdit && activityToEdit.id ? 'Editar' : 'Nueva'} Actividad</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField name="description" label="Título de la Actividad" value={activity.description} onChange={handleChange} required />
                    <InputField name="date" label="Fecha" type="date" value={activity.date} onChange={handleChange} required />
                    <InputField name="note" label="Notas Adicionales" value={activity.note} onChange={handleChange} as="textarea" />
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};