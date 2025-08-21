import { useState, useEffect } from 'react';

const FUNNEL_STAGES = {
    'PROSPECTO': 'Prospecto',
    'INFO_SOLICITADA': 'Info Solicitada',
    'EN_ARMADO': 'En Armado',
    'EN_CALIFICACION': 'En Calificación',
    'PROPUESTA_FIRMADA': 'Propuesta Firmada',
    'GANADO': 'Ganado',
    'PERDIDO': 'Perdido',
};

export const useFunnel = (initialNegocios, onUpdateNegocio) => {
    const [columns, setColumns] = useState({});
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        const newColumns = Object.keys(FUNNEL_STAGES).reduce((acc, stageKey) => {
            acc[stageKey] = { name: FUNNEL_STAGES[stageKey], items: [] };
            return acc;
        }, {});

        (initialNegocios || []).forEach(negocio => {
            const stageKey = negocio.estado || 'PROSPECTO';
            if (newColumns[stageKey]) {
                newColumns[stageKey].items.push(negocio);
            } else {
                newColumns['PROSPECTO'].items.push(negocio);
            }
        });
        setColumns(newColumns);
    }, [initialNegocios]);

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({ ...columns, [source.droppableId]: { ...column, items: copiedItems } });
            return;
        }

        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const [movedItem] = sourceItems.splice(source.index, 1);
        const destItems = [...destColumn.items];
        destItems.splice(destination.index, 0, movedItem);

        setColumns({
            ...columns,
            [source.droppableId]: { ...sourceColumn, items: sourceItems },
            [destination.droppableId]: { ...destColumn, items: destItems }
        });

        // 👇 CAMBIO REALIZADO AQUÍ
        setModalData({
            negocio: movedItem,
            newStatus: destination.droppableId,
            newStatusName: FUNNEL_STAGES[destination.droppableId] 
        });
    };

    const handleModalClose = () => {
        const revertedColumns = Object.keys(FUNNEL_STAGES).reduce((acc, stageKey) => {
            acc[stageKey] = { name: FUNNEL_STAGES[stageKey], items: [] };
            return acc;
        }, {});
        (initialNegocios || []).forEach(negocio => {
            const stageKey = negocio.estado || 'PROSPECTO';
            if (revertedColumns[stageKey]) {
                revertedColumns[stageKey].items.push(negocio);
            }
        });
        setColumns(revertedColumns);
        setModalData(null);
    };
    
    const handleModalSave = (formData) => {
        if (!modalData) return;
        const { negocio, newStatus } = modalData;

        const negocioActualizado = {
            ...negocio,
            estado: newStatus,
            lastUpdate: new Date().toISOString(),
            history: [
                ...(negocio.history || []),
                {
                    date: new Date().toISOString(),
                    type: `Cambio de Etapa: ${FUNNEL_STAGES[newStatus]}`,
                    reason: formData.reason,
                    user: 'Usuario Actual'
                }
            ]
        };
        onUpdateNegocio(negocioActualizado);
        setModalData(null);
    };

    return { columns, handleOnDragEnd, modalData, handleModalSave, handleModalClose };
};