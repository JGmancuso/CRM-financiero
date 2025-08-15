import React, { useState, useEffect } from 'react';
import InputField from '../common/InputField';

export default function ActivityModal({ onClose, onSave, activityToEdit }) {
    const [activity, setActivity] = useState(activityToEdit || { type: 'task', title: '', date: new Date().toISOString().slice(0, 16), note: '' });
    
    useEffect(() => {
        setActivity(activityToEdit || { type: 'task', title: '', date: new Date().toISOString().slice(0, 16), note: '' });
    }, [activityToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivity(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!activity.title || !activity.date) return;
        onSave(activity);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{activityToEdit ? 'Editar' : 'Nueva'} Actividad</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <div className="flex rounded-md shadow-sm">
                            <button type="button" onClick={() => setActivity(prev => ({ ...prev, type: 'task' }))} className={`px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${activity.type === 'task' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Tarea</button>
                            <button type="button" onClick={() => setActivity(prev => ({ ...prev, type: 'event' }))} className={`-ml-px px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${activity.type === 'event' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Evento</button>
                        </div>
                    </div>
                    <InputField name="title" label="Título" value={activity.title} onChange={handleChange} required />
                    <InputField name="date" label="Fecha y Hora" type="datetime-local" value={activity.date} onChange={handleChange} required />
                    <InputField name="note" label="Notas" value={activity.note} onChange={handleChange} />
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};