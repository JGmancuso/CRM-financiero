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
    relevamiento: '', review: '',financialEntities: [],
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

        // --- 👇 LÓGICA FALTANTE AÑADIDA AQUÍ 👇 ---
    const [newEntityName, setNewEntityName] = useState('');
    const [newEntityType, setNewEntityType] = useState('ALYC');

    const handleAddEntity = () => {
        if (newEntityName.trim() === '') return;
        const newEntity = {
            id: `fe-${Date.now()}`,
            type: newEntityType,
            name: newEntityName.trim(),
        };
        const updatedEntities = [...(client.financialEntities || []), newEntity];
        setClient(prev => ({ ...prev, financialEntities: updatedEntities }));
        setNewEntityName('');
    };

    const handleRemoveEntity = (entityId) => {
        const updatedEntities = (client.financialEntities || []).filter(e => e.id !== entityId);
        setClient(prev => ({ ...prev, financialEntities: updatedEntities }));
    };
    // --- 👆 FIN DE LA LÓGICA FALTANTE 👆 ---

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
                {/* --- 👇 NUEVA SECCIÓN PARA ALYCS Y BANCOS 👇 --- */}
                <div className="p-4 border rounded-lg bg-gray-50/50">
                    <h3 className="font-semibold text-gray-700 mb-3">Entidades Financieras (ALYCs / Bancos)</h3>
                    <div className="space-y-2 mb-4">
                        {(client.financialEntities || []).map(entity => (
                            <div key={entity.id} className="flex justify-between items-center bg-white p-2 rounded-md border text-sm">
                                <div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${entity.type === 'ALYC' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{entity.type}</span>
                                    <span className="ml-3 text-gray-800">{entity.name}</span>
                                </div>
                                <button type="button" onClick={() => handleRemoveEntity(entity.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2">
                        <select value={newEntityType} onChange={(e) => setNewEntityType(e.target.value)} className="border rounded-md px-2 py-1.5 text-sm bg-white">
                            <option value="ALYC">ALYC</option>
                            <option value="Banco">Banco</option>
                        </select>
                        <input type="text" value={newEntityName} onChange={(e) => setNewEntityName(e.target.value)} placeholder="Nombre de la entidad..." className="flex-grow border rounded-md px-2 py-1 text-sm"/>
                        <button type="button" onClick={handleAddEntity} className="bg-blue-500 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-blue-600 text-sm">Añadir</button>
                    </div>
                </div>
                {/* --- 👆 FIN DE LA NUEVA SECCIÓN 👆 --- */}
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar Cliente</button>
                </div>
            </form>
        </div>
    );
}