// src/hooks/useFunnel.js

import { useState, useMemo } from 'react';
import { FUNNEL_STAGES } from '../data';

export function useFunnel(clients) {
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [draggedToStatus, setDraggedToStatus] = useState('');

    const handleManageClick = (client) => {
        setSelectedClient(client);
        setModalType('detail');
    };
    
    const handleAdvanceClick = () => {
        if (!selectedClient) return;
        if (selectedClient.management.status === FUNNEL_STAGES.EN_CALIFICACION) {
            setModalType('qualification');
        } else {
            setModalType('status');
        }
    };

    const closeModal = () => {
        setSelectedClient(null);
        setModalType(null);
        setDraggedToStatus('');
    };

    const handleOnDragEnd = (result) => {
        const { source, destination, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) {
            return;
        }
        const client = clients.find(c => c.management.id === draggableId);
        if (client) {
            setSelectedClient(client);
            setDraggedToStatus(destination.droppableId);
            setModalType('status');
        }
    };

    const funnelData = useMemo(() => {
        const stages = Object.values(FUNNEL_STAGES);
        const grouped = stages.reduce((acc, stage) => ({ ...acc, [stage]: [] }), {});
        
        (clients || []).forEach(client => {
            if (client.management && grouped.hasOwnProperty(client.management.status)) {
                grouped[client.management.status].push(client);
            }
        });

        for (const stage in grouped) {
            grouped[stage].sort((a, b) => {
                const dateA = new Date(a.management.history[a.management.history.length - 1].date);
                const dateB = new Date(b.management.history[b.management.history.length - 1].date);
                return dateA - dateB;
            });
        }

        return stages.map(stage => ({ id: stage, name: stage.replace(/_/g, ' '), clients: grouped[stage] }));
    }, [clients]);

    return {
        funnelData,
        selectedClient,
        modalType,
        draggedToStatus,
        handleManageClick,
        handleAdvanceClick,
        closeModal,
        handleOnDragEnd
    };
}