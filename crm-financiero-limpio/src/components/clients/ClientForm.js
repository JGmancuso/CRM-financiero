import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { FUNNEL_STAGES, industries } from '../../data';
import InputField from '../common/InputField';

export default function ClientForm({ onSave, onCancel, clientToEdit }) {
    const [client, setClient] = useState(clientToEdit || {});

    useEffect(() => {
        setClient(clientToEdit || {
            type: 'juridica', name: '', cuit: '', cuil: '', birthDate: '', activity: '', email: '', phone: '', review: '', relevamiento: '', industry: industries[0], location: '', provincia: '', hasForeignTrade: false, sellsToFinalConsumer: false, partners: [], qualifications: [], hasIndependentActivity: false, contactPerson: { name: '', role: '', email: '', phone: '' },
            status: FUNNEL_STAGES.prospect
        });
    }, [clientToEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setClient(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));
    };
    
    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setClient(prev => ({...prev, contactPerson: { ...prev.contactPerson, [name]: value }}));
    };

    const handlePartnersChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...(client.partners || [])];
        list[index][name] = name === 'share' ? parseFloat(value) || 0 : value;
        setClient(prev => ({...prev, partners: list}));
    };

    const addPartner = () => {
        setClient(prev => ({...prev, partners: [...(prev.partners || []), {id: `p-${Date.now()}`, type: 'fisica', name: '', cuil: '', share: 0}]}));
    };

    const removePartner = (index) => {
        const list = [...client.partners];
        list.splice(index, 1);
        setClient(prev => ({...prev, partners: list}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(client);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{clientToEdit && clientToEdit.id ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... (secciones existentes) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField name="name" label="Nombre / Razón Social" value={client.name} onChange={handleChange} required />
                    <InputField name="status" label="Estado en Embudo" value={client.status} onChange={handleChange} select>{Object.values(FUNNEL_STAGES).map(s => <option key={s}>{s}</option>)}</InputField>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Cliente</label>
                    <select name="type" value={client.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="juridica">Persona Jurídica</option>
                        <option value="fisica">Persona Física</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {client.type === 'juridica' ? <InputField name="cuit" label="CUIT" value={client.cuit} onChange={handleChange} required /> : <InputField name="cuil" label="CUIL" value={client.cuil} onChange={handleChange} required />}
                    <InputField name="email" label="Email Principal" type="email" value={client.email} onChange={handleChange} required />
                    <InputField name="phone" label="Teléfono Principal" value={client.phone} onChange={handleChange} />
                    <InputField name="industry" label="Industria" value={client.industry} onChange={handleChange} select>
                        {industries.map(i => <option key={i}>{i}</option>)}
                    </InputField>
                    <InputField name="location" label="Localidad" value={client.location} onChange={handleChange} />
                    <InputField name="provincia" label="Provincia" value={client.provincia} onChange={handleChange} />
                    {client.type === 'juridica' ? <InputField name="activity" label="Actividad Principal" value={client.activity} onChange={handleChange} /> : <>
                        <InputField name="birthDate" label="Fecha de Nacimiento" type="date" value={client.birthDate} onChange={handleChange} />
                        <div><label className="flex items-center pt-6"><input type="checkbox" name="hasIndependentActivity" checked={client.hasIndependentActivity} onChange={handleChange} className="rounded" /><span className="ml-2 text-sm text-gray-600">¿Tiene actividad independiente?</span></label></div>
                    </>}
                    <div className="flex items-center"><input type="checkbox" name="hasForeignTrade" checked={client.hasForeignTrade} onChange={handleChange} className="rounded mr-2" /><span className="text-sm text-gray-600">¿Realiza Comercio Exterior?</span></div>
                    <div className="flex items-center"><input type="checkbox" name="sellsToFinalConsumer" checked={client.sellsToFinalConsumer} onChange={handleChange} className="rounded mr-2" /><span className="text-sm text-gray-600">¿Vende a Consumidor Final?</span></div>
                </div>

                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Datos del Contacto</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField name="name" label="Nombre y Apellido" value={client.contactPerson?.name} onChange={handleContactChange} />
                        <InputField name="role" label="Cargo" value={client.contactPerson?.role} onChange={handleContactChange} />
                        <InputField name="email" label="Email de Contacto" type="email" value={client.contactPerson?.email} onChange={handleContactChange} />
                        <InputField name="phone" label="Teléfono de Contacto" value={client.contactPerson?.phone} onChange={handleContactChange} />
                    </div>
                </div>
                
                <InputField name="relevamiento" label="Relevamiento" value={client.relevamiento} onChange={handleChange} />
                <InputField name="review" label="Reseña" value={client.review} onChange={handleChange} />

                {client.type === 'juridica' && (
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Esquema Societario</h3>
                        {(client.partners || []).map((partner, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end mb-2 p-2 bg-gray-50 rounded">
                                <div className="col-span-4"><InputField label="Nombre/Razón Social" name="name" value={partner.name} onChange={e => handlePartnersChange(index, e)} /></div>
                                <div className="col-span-4"><InputField label="CUIT/CUIL" name="cuil" value={partner.cuil} onChange={e => handlePartnersChange(index, e)} /></div>
                                <div className="col-span-3"><InputField label="%" name="share" type="number" value={partner.share} onChange={e => handlePartnersChange(index, e)} /></div>
                                <div className="col-span-1"><button type="button" onClick={() => removePartner(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={18} /></button></div>
                            </div>
                        ))}
                        <button type="button" onClick={addPartner} className="text-sm text-blue-600 hover:text-blue-800 mt-2">+ Agregar Socio</button>
                    </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar Cliente</button>
                </div>
            </form>
        </div>
    );
}


