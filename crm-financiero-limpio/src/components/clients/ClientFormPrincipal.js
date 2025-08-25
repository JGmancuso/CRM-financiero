import React from 'react';
import InputField from '../../common/InputField';
import { industries } from '../../../data';

export default function ClientFormPrincipal({ data, onChange }) {
    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Información Principal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 👇 CORRECCIÓN: Usamos 'nombre' en el 'name' y 'value' del input */}
                <InputField name="nombre" label="Nombre / Razón Social" value={data.nombre || ''} onChange={onChange} required />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Cliente</label>
                    <select name="type" value={data.type || 'juridica'} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="juridica">Persona Jurídica</option>
                        <option value="fisica">Persona Física</option>
                    </select>
                </div>
                <InputField name="cuit" label="CUIT / CUIL" value={data.cuit || ''} onChange={onChange} required />
                <InputField name="email" label="Email Principal" type="email" value={data.email || ''} onChange={onChange} />
                <InputField name="phone" label="Teléfono Principal" value={data.phone || ''} onChange={onChange} />
                <InputField name="industry" label="Industria" value={data.industry || ''} onChange={onChange} select>
                    {industries.map(i => <option key={i}>{i}</option>)}
                </InputField>
                 <InputField name="location" label="Localidad" value={data.location || ''} onChange={onChange} />
                <InputField name="provincia" label="Provincia" value={data.provincia || ''} onChange={onChange} />
            </div>
        </div>
    );
}