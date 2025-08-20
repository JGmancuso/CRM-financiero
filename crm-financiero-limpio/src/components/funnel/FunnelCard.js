// src/components/funnel/FunnelCard.js

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Clock } from 'lucide-react';

export default function FunnelCard({ client, index, onManageClick }) {
    const history = client.management.history;
    let daysInStage = 0;
    if (history && history.length > 0) {
        const lastEventDate = new Date(history[history.length - 1].date);
        const today = new Date();
        daysInStage = Math.floor((today - lastEventDate) / (1000 * 60 * 60 * 24));
    }

    return (
        <Draggable key={client.management.id} draggableId={client.management.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition relative cursor-pointer"
                    onClick={() => onManageClick(client)}
                >
                    <div className="absolute top-2 right-2 bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <Clock size={12} className="mr-1" />
                        {daysInStage}d
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-bold text-gray-800 pr-10">
                            {client.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 italic">
                            {client.relevamiento || 'Sin motivo de contacto'}
                        </p>
                    </div>
                </div>
            )}
        </Draggable>
    );
}