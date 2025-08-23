import React, { useState } from 'react';
import { Save, Building2, Activity, Clock, PlusCircle, Trash2, Edit } from 'lucide-react';

// Sub-componente para el formulario de Añadir/Editar
const CalificacionForm = ({ sgrs, initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg mt-4 space-y-4">
            <h4 className="font-semibold text-gray-800">{formData.id ? 'Editando Calificación' : 'Añadir Nueva Calificación'}</h4>
            <div>
                <label className="text-sm font-medium text-gray-700">Entidad de Garantía (SGR)</label>
                <select name="entidad" value={formData.entidad} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-white mt-1">
                    <option value="">-- Seleccionar SGR --</option>
                    {(sgrs || []).map(sgr => (<option key={sgr.id} value={sgr.name}>{sgr.name}</option>))}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <select name="estado" value={formData.estado} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-white mt-1">
                    <option>Pendiente</option>
                    <option>En Análisis</option>
                    <option>Aprobada</option>
                    <option>Rechazada</option>
                </select>
            </div>
            {formData.estado === 'Aprobada' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-3">
                    <h5 className="font-semibold text-green-800">Datos de la Aprobación</h5>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Monto Aprobado</label>
                        <input type="number" name="montoAprobado" value={formData.montoAprobado} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Destino</label>
                        <input type="text" name="destino" value={formData.destino} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Vencimiento</label>
                        <input type="date" name="vencimiento" value={formData.vencimiento} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1"/>
                    </div>
                </div>
            )}
            <div className="flex justify-end space-x-2">
                <button onClick={onCancel} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button onClick={() => onSave(formData)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar</button>
            </div>
        </div>
    );
};

export default function CalificacionPanel({ negocio, onSave, sgrs }) {
    const [calificaciones, setCalificaciones] = useState(negocio.calificaciones || []);
    const [editingItem, setEditingItem] = useState(null);
    
    const daysSince = (dateString) => {
        if (!dateString) return null;
        const today = new Date();
        const startDate = new Date(dateString + 'T00:00:00');
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleAddNew = () => {
        setEditingItem({
            id: `temp-${Date.now()}`,
            entidad: '',
            estado: 'En Análisis',
            fechaPresentacion: new Date().toISOString().split('T')[0],
            montoAprobado: '',
            destino: '',
            vencimiento: ''
        });
    };
    
    const handleSaveItem = (itemData) => {
        const isNew = itemData.id.toString().startsWith('temp-');
        if (isNew) {
            setCalificaciones([...calificaciones, { ...itemData, id: `qual-${Date.now()}` }]);
        } else {
            setCalificaciones(calificaciones.map(c => c.id === itemData.id ? itemData : c));
        }
        setEditingItem(null);
    };

    const handleDeleteItem = (itemId) => {
        setCalificaciones(calificaciones.filter(c => c.id !== itemId));
    };

    const handleSaveChanges = () => {
        const updatedNegocio = {
            ...negocio,
            calificaciones: calificaciones
        };
        onSave(updatedNegocio);
    };

    return (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-800">Panel de Calificación</h3>
                {!editingItem && <button onClick={handleAddNew} className="flex items-center text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100"><PlusCircle size={16} className="mr-2"/> Añadir SGR</button>}
            </div>

            <div className="space-y-2">
                {calificaciones.map(item => {
                    const diasEnAnalisis = item.estado === 'En Análisis' ? daysSince(item.fechaPresentacion) : null;
                    return (
                        <div key={item.id} className="bg-white p-3 rounded-md shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{item.entidad}</p>
                                    <p className="text-sm text-gray-600">Estado: <span className="font-semibold">{item.estado}</span></p>
                                </div>
                                <div>
                                    <button onClick={() => setEditingItem(item)} className="p-1 text-gray-500 hover:text-blue-600"><Edit size={18}/></button>
                                    <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={18}/></button>
                                </div>
                            </div>
                            {diasEnAnalisis !== null && (
                                <div className="mt-2 text-sm text-yellow-800 bg-yellow-100 border-l-4 border-yellow-400 p-2 flex items-center rounded-r-md">
                                    <Clock size={16} className="mr-2"/>
                                    <span>En análisis hace <strong>{diasEnAnalisis} día(s)</strong>.</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {editingItem && <CalificacionForm sgrs={sgrs} initialData={editingItem} onSave={handleSaveItem} onCancel={() => setEditingItem(null)} />}

            <div className="flex justify-end mt-6">
                <button onClick={handleSaveChanges} className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition">
                    <Save size={16} className="mr-2"/> Guardar Todos los Cambios
                </button>
            </div>
        </div>
    );
}