// src/components/funnel/FunnelColumn.js

import React from 'react'; // <- ESTA ES LA LÍNEA QUE FALTABA
import { Droppable } from 'react-beautiful-dnd';
import NegocioCard from './NegocioCard';

export default function FunnelColumn({ columnId, column, onUpdateNegocio }) {
    if (!column) {
        return null;
    }

    return (
        <div className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0 flex flex-col h-full">
            {/* Encabezado de la Columna */}
            <h2 className="font-bold text-lg mb-4 text-gray-700 flex justify-between items-center flex-shrink-0">
                <span>{column.name}</span>
                <span className="bg-gray-300 text-gray-600 rounded-full px-2 py-0.5 text-sm font-medium">{column.items.length}</span>
            </h2>

            {/* Zona para "soltar" las tarjetas */}
            <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        // Estilo dinámico que cambia de color cuando arrastramos algo sobre la columna
                        className={`flex-grow min-h-96 rounded-lg p-2 transition-colors duration-200 ease-in-out ${
                            snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-transparent'
                        }`}
                    >
                        {column.items.map((negocio, index) => (
                            <NegocioCard
                                key={negocio.id}
                                negocio={negocio}
                                index={index}
                                onUpdateNegocio={onUpdateNegocio}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}