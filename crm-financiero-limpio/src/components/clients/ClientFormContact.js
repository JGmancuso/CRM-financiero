import React from 'react';
import InputField from '../../common/InputField';

export default function ClientFormContact({ data, onChange }) {
    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Datos del Contacto</h3>
            <div className="grid grid-cols-2 gap-4">
                <InputField name="name" label="Nombre y Apellido" value={data?.name || ''} onChange={onChange} />
                <InputField name="role" label="Cargo" value={data?.role || ''} onChange={onChange} />
                <InputField name="email" label="Email de Contacto" type="email" value={data?.email || ''} onChange={onChange} />
                <InputField name="phone" label="Teléfono de Contacto" value={data?.phone || ''} onChange={onChange} />
            </div>
        </div>
    );
}