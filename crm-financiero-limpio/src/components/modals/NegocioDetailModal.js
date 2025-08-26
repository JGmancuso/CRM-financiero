import React, { useState, useEffect } from 'react';
import { X, Edit, Save, User, DollarSign, Flag, AlertTriangle, Info, Clock, RefreshCw } from 'lucide-react';
import CalificacionPanel from '../funnel/CalificacionPanel';
import { daysSince, findLastStageChangeDate } from '../../utils/negocioUtils';

// Define funnel stages here to make the component self-contained
const FUNNEL_STAGES = {
    'PROSPECTO': 'Prospecto', 'INFO_SOLICITADA': 'Info Solicitada', 'EN_ARMADO': 'En Armado',
    'EN_CALIFICACION': 'En Calificación', 'PROPUESTA_FIRMADA': 'Propuesta Firmada',
    'GANADO': 'Ganado', 'PERDIDO': 'Perdido',
};

export default function NegocioDetailModal({ negocio, onClose, onSave, sgrs }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...negocio });

    useEffect(() => { setFormData({ ...negocio }); }, [negocio]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave({ ...formData, montoSolicitado: parseFloat(formData.montoSolicitado) || 0 });
        setIsEditing(false);
    };

    const daysSince = (dateString) => {
        if (!dateString) return 'N/A';
        const today = new Date();
        const pastDate = new Date(dateString);
        today.setHours(0, 0, 0, 0);
        pastDate.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(today - pastDate);
        return `${Math.ceil(diffTime / (1000 * 60 * 60 * 24))} día(s)`;
    };

    const findLastStageChangeDate = () => {
        if (!negocio.history || negocio.history.length === 0) return negocio.creationDate;
        const lastChange = [...negocio.history].reverse().find(item => item.type?.includes('Cambio a:'));
        return lastChange ? lastChange.date : negocio.creationDate;
    };
    
    const diasEnEstado = daysSince(findLastStageChangeDate(negocio));
    const diasDesdeUltimaModificacion = daysSince(negocio.lastUpdate);

    const montoFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency', currency: negocio.moneda || 'ARS',
    }).format(negocio.montoSolicitado || 0);

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative max-h-[90vh] flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"><X size={28} /></button>
                
                {/* --- ENCABEZADO (Editable / No Editable) --- */}
                <div className="pb-6 border-b border-gray-200 flex-shrink-0">
                   {isEditing ? (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">Editando Negocio</h2>
                             <div>
                                <label className="text-sm font-medium text-gray-500">Etapa del Embudo</label>
                                <select name="estado" value={formData.estado} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                                    {Object.entries(FUNNEL_STAGES).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Título / Motivo</label>
                                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Monto Solicitado</label>
                                <input type="number" name="montoSolicitado" value={formData.montoSolicitado} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Observaciones</label>
                                <textarea name="motivoUltimoCambio" value={formData.motivoUltimoCambio} onChange={handleInputChange} rows="3" className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                               <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300">Cancelar</button>
                               <button onClick={handleSave} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 flex items-center"><Save size={16} className="mr-2"/> Guardar</button>
                            </div>
                        </div>
                   ) : (
                        <div>
                            <div className="flex justify-between items-start">
                                <div className="max-w-xl">
                                    <h2 className="text-2xl font-bold text-gray-800">{negocio.nombre}</h2>
                                    <p className="text-gray-500 flex items-center mt-1"><User size={14} className="mr-2"/> {negocio.cliente.nombre}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{montoFormateado}</p>
                                </div>
                                <button onClick={() => setIsEditing(true)} className="flex items-center text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50">
                                    <Edit size={16} className="mr-2"/> Editar
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                <div className="flex items-center text-gray-600"><Clock size={16} className="mr-2"/> <span><strong>En estado:</strong> {diasEnEstado}</span></div>
                                <div className="flex items-center text-gray-600"><RefreshCw size={16} className="mr-2"/> <span><strong>Últ. Modif.:</strong> hace {diasDesdeUltimaModificacion}</span></div>
                            </div>
                        </div>
                   )}
                </div>

                {/* --- CUERPO DEL MODAL (con scroll si es necesario) --- */}
                <div className="flex-grow overflow-y-auto pt-6">
                    {/* --- INFO GENERAL (Siempre visible) --- */}
                    <div className="space-y-3">
                        {negocio.motivoUltimoCambio && (<div className="flex items-start text-gray-700 bg-gray-100 p-3 rounded-md"><Info size={16} className="mr-3 mt-0.5 flex-shrink-0" /><p>{negocio.motivoUltimoCambio}</p></div>)}
                        {negocio.proximosPasos && (<div className="flex items-start text-green-800 bg-green-50 p-3 rounded-md"><Flag size={16} className="mr-3 mt-0.5 flex-shrink-0" /><p>{negocio.proximosPasos}</p></div>)}
                        {negocio.documentacionFaltante && (<div className="flex items-start text-yellow-800 bg-yellow-50 p-3 rounded-md"><AlertTriangle size={16} className="mr-3 mt-0.5 flex-shrink-0" /><p>{negocio.documentacionFaltante}</p></div>)}
                    </div>

                    {/* --- PANEL DE CALIFICACIÓN (Solo para ese estado) --- */}
                    {negocio.estado === 'EN_CALIFICACION' && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <CalificacionPanel negocio={negocio} onSave={onSave} sgrs={sgrs} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}