import React, { useState, useEffect } from 'react';
import InputField from '../common/InputField';

export default function ActivityModal({ onClose, onSave, activityToEdit }) {
    const getInitialState = () => ({
        type: 'task',
        description: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
        completed: false
    });

    const [activity, setActivity] = useState(activityToEdit || getInitialState());
    
    useEffect(() => {
        if (activityToEdit) {
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
        if (!activity.description || !activity.date) return;
        
        // Preparamos el objeto a guardar
        const dataToSave = {
            title: activity.description, // Mapeamos al campo 'title' que espera la agenda
            dueDate: activity.date, // Mapeamos al campo 'dueDate'
            details: activity.note,
        };

        // Si no hay cliente, lo marcamos como 'General'
        if (!activity.clientId) {
            dataToSave.clientName = 'Tarea General';
        }
        
        // Si estamos editando, mantenemos el id original
        if (activity.id) {
            dataToSave.id = activity.id;
        }

        onSave(dataToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{activityToEdit ? 'Editar' : 'Nuevo'} Evento/Tarea</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... (el resto del formulario no cambia) ... */}
                    <InputField name="description" label="Título" value={activity.description} onChange={handleChange} required />
                    <InputField name="date" label="Fecha" type="date" value={activity.date} onChange={handleChange} required />
                    <InputField name="note" label="Notas Adicionales" value={activity.note} onChange={handleChange} />
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};