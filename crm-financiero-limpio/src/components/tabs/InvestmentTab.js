import React from 'react';
import { BarChart2, User, DollarSign } from 'lucide-react';
import InfoItem from '../common/InfoItem';

export default function InvestmentTab({ client }) {
    if (!client.investment) {
        return <div className="text-center text-gray-500 p-8"><BarChart2 size={40} className="mx-auto mb-2" />Este cliente no tiene perfil de inversión.</div>;
    }
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Perfil de Inversión</h3>
            <div className="bg-blue-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                <InfoItem icon={<User size={20} />} label="Perfil de Riesgo" value={client.investment.profile} />
                <InfoItem icon={<DollarSign size={20} />} label="Moneda de Operación" value={client.investment.currency} />
            </div>
        </div>
    );
}