import React, { useState } from 'react';

export default function QualificationAssignmentModal({ sgrs, onClose, onSave }) {
    const [selectedSgrs, setSelectedSgrs] = useState([]);

    const handleCheckboxChange = (sgrName) => {
        setSelectedSgrs(prev => 
            prev.includes(sgrName) 
                ? prev.filter(name => name !== sgrName)
                : [...prev, sgrName]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ sgrsToQualify: selectedSgrs });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-6">Asignar a Calificación</h2>
                <p className="text-gray-600 mb-4">Selecciona las SGRs a las que se envió la carpeta. Se creará una tarea de seguimiento para cada una.</p>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-2 mb-6">
                        {sgrs.map(sgr => (
                            <label key={sgr.id} className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={selectedSgrs.includes(sgr.name)}
                                    onChange={() => handleCheckboxChange(sgr.name)}
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">{sgr.name}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Confirmar y Crear Tareas</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
