import React from 'react';
import InputField from '../../common/InputField';
import { Trash2 } from 'lucide-react';

export default function ClientFormSocios({ partners, onChange, onAdd, onRemove }) {
    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Esquema Societario</h3>
            {partners.map((partner, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end mb-2 p-2 bg-gray-50 rounded">
                    <div className="col-span-4"><InputField label="Nombre/Razón Social" name="name" value={partner.name} onChange={e => onChange(index, e)} /></div>
                    <div className="col-span-4"><InputField label="CUIT/CUIL" name="cuil" value={partner.cuil} onChange={e => onChange(index, e)} /></div>
                    <div className="col-span-3"><InputField label="%" name="share" type="number" value={partner.share} onChange={e => onChange(index, e)} /></div>
                    <div className="col-span-1"><button type="button" onClick={() => onRemove(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={18} /></button></div>
                </div>
            ))}
            <button type="button" onClick={onAdd} className="text-sm text-blue-600 hover:text-blue-800 mt-2">+ Agregar Socio</button>
        </div>
    );
}