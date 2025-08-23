import React from 'react';
import NegocioCard from './NegocioCard';

// Recibimos 'onCardClick' como prop
export default function FunnelColumn({ id, title, negocios, onCardClick }) {
    // Hemos añadido una comprobación para 'negocios' para más seguridad
    const negociosEnColumna = negocios || [];

    return (
        <div className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0 flex flex-col h-full">
            <h2 className="font-bold text-lg mb-4 text-gray-700 flex justify-between items-center">
                <span>{title}</span>
                <span className="bg-gray-300 text-gray-600 rounded-full px-2 py-0.5 text-sm">{negociosEnColumna.length}</span>
            </h2>
            <div className="flex-grow min-h-96 rounded-lg p-2 space-y-4 overflow-y-auto">
                {negociosEnColumna.map(negocio => (
                    <NegocioCard
                        key={negocio.id}
                        negocio={negocio}
                        // Le pasamos la función a cada tarjeta
                        onCardClick={onCardClick}
                    />
                ))}
            </div>
        </div>
    );
}