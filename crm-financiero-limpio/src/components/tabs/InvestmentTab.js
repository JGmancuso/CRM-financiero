import React, { useState } from 'react';
import { BarChart2, User, DollarSign, Building2, Edit } from 'lucide-react';
import InfoItem from '../common/InfoItem';
import InvestmentProfileModal from '../modals/InvestmentProfileModal'; // Importamos el nuevo modal

export default function InvestmentTab({ client, onUpdateClient }) {
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (investmentData) => {
        // Creamos una copia actualizada del cliente con los nuevos datos de inversión
        const updatedClient = {
            ...client,
            investment: investmentData,
        };
        // Llamamos a la función de App.js para guardar los cambios
        onUpdateClient(updatedClient);
        setIsEditing(false); // Cerramos el modal
    };

    // Si no hay perfil, mostramos un botón para crearlo
    if (!client.investment) {
        return (
            <div className="text-center text-gray-500 p-8">
                <BarChart2 size={40} className="mx-auto mb-2" />
                <p>Este cliente no tiene perfil de inversión.</p>
                <button 
                    onClick={() => setIsEditing(true)} 
                    className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    Crear Perfil
                </button>
                {isEditing && <InvestmentProfileModal investment={{}} onClose={() => setIsEditing(false)} onSave={handleSave} />}
            </div>
        );
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Perfil de Inversión</h3>
                <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-blue-600 font-semibold hover:underline">
                    <Edit size={16} className="mr-1" />
                    Editar
                </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<User size={20} />} label="Perfil de Riesgo" value={client.investment.profile} />
                <InfoItem icon={<DollarSign size={20} />} label="Moneda de Operación" value={client.investment.currency} />
                {/* 👇 NUEVO CAMPO AÑADIDO 👇 */}
                <InfoItem icon={<Building2 size={20} />} label="ALyC / Banco" value={client.investment.broker || 'No especificado'} />
            </div>

            {isEditing && (
                <InvestmentProfileModal
                    investment={client.investment}
                    onClose={() => setIsEditing(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}