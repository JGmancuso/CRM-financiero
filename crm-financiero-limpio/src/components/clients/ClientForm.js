import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { industries } from '../../data'; // Asumo que tienes industries en data.js
import InputField from '../common/InputField';
// Importa los sub-componentes del formulario
import ClientFormPrincipal from './form/ClientFormPrincipal';
import ClientFormContact from './form/ClientFormContact';
import ClientFormDetails from './form/ClientFormDetails';
import ClientFormSocios from './form/ClientFormSocios';

const defaultClient = {
    type: 'juridica', nombre: '', cuit: '', email: '', phone: '',
    industry: '', location: '', provincia: '', lastFiscalClose: '',
    hasForeignTrade: false, sellsToFinalConsumer: false, partners: [],
    contactPerson: { name: '', role: '', email: '', phone: '' },
    relevamiento: '', review: ''
};

export default function ClientForm({ onSave, onCancel, clientToEdit, initialCuit = '' }) {
    const [client, setClient] = useState(clientToEdit || { ...defaultClient, cuit: initialCuit });

    useEffect(() => {
        if (clientToEdit) {
            setClient({ ...defaultClient, ...clientToEdit });
        } else {
            setClient({ ...defaultClient, cuit: initialCuit });
        }
    }, [clientToEdit, initialCuit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setClient(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setClient(prev => ({ ...prev, contactPerson: { ...prev.contactPerson, [name]: value } }));
    };

    const handlePartnersChange = (index, event) => {
        // --- 👇 LÍNEA CORREGIDA AQUÍ 👇 ---
        const { name, value } = event.target; 
        const list = [...(client.partners || [])];
        list[index][name] = name === 'share' ? parseFloat(value) || 0 : value;
        setClient(prev => ({ ...prev, partners: list }));
    };

    const addPartner = () => {
        setClient(prev => ({ ...prev, partners: [...(prev.partners || []), { id: `p-${Date.now()}`, name: '', cuil: '', share: 0 }] }));
    };

    const removePartner = (index) => {
        const list = [...client.partners];
        list.splice(index, 1);
        setClient(prev => ({ ...prev, partners: list }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Esta línea es correcta. Simplemente pasa los datos al padre.
        onSave(client); 
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{clientToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <ClientFormPrincipal data={client} onChange={handleChange} />
                <ClientFormContact data={client.contactPerson} onChange={handleContactChange} />
                <ClientFormDetails data={client} onChange={handleChange} />
                
                {client.type === 'juridica' && (
                    <ClientFormSocios 
                        partners={client.partners || []} 
                        onChange={handlePartnersChange} 
                        onAdd={addPartner} 
                        onRemove={removePartner} 
                    />
                )}
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar Cliente</button>
                </div>
            </form>
        </div>
    );
}