import React from 'react';
import ClientGroup from './ClientGroup';

// 👇 Añadimos ' = []' para darle un valor por defecto a la prop
export default function FunnelColumn({ title, businessGroups = [], onCardClick }) {
    
    // Calculamos el total de negocios de forma segura
    const totalNegocios = businessGroups.reduce((acc, group) => acc + group.negocios.length, 0);

    return (
        <div className="bg-gray-100 rounded-lg p-3 w-80 flex-shrink-0">
            <h3 className="font-bold text-md text-gray-600 mb-4 px-1">{title} ({totalNegocios})</h3>
            <div className="overflow-y-auto h-full pr-1">
                {businessGroups.map(group => (
                    <ClientGroup
                        key={group.clientName}
                        clientName={group.clientName}
                        negocios={group.negocios}
                        onCardClick={onCardClick}
                    />
                ))}
            </div>
        </div>
    );
}