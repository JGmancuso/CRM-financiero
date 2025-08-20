// src/components/funnel/FunnelColumn.js

import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import FunnelCard from './FunnelCard';

export default function FunnelColumn({ stage, onManageClick }) {
    return (
        <Droppable droppableId={stage.id}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-200 p-4 rounded-lg w-80 flex-shrink-0 flex flex-col h-full">
                    <h2 className="text-xl font-semibold mb-4 capitalize text-gray-700">{stage.name}</h2>
                    <div className="space-y-2 flex-grow overflow-y-auto px-1">
                        {stage.clients.map((client, index) => (
                            <FunnelCard
                                key={client.management.id}
                                client={client}
                                index={index}
                                onManageClick={onManageClick}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
}