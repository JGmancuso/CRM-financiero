// src/context/reducers/negocioReducer.js

export const negocioReducer = (negociosState, action) => {
    const now = new Date().toISOString();

    switch (action.type) {
        case 'ADD_NEW_BUSINESS': {
            const { client, businessData } = action.payload;
            const newBusiness = {
                id: `negocio-${client.id}-${Date.now()}`,
                nombre: businessData.motivo,
                estado: 'PROSPECTO',
                montoSolicitado: businessData.montoAproximado,
                fechaProximoSeguimiento: now,
                // Añadimos las nuevas fechas al crear
                creationDate: now,
                lastUpdate: now,
                history: [{
                    date: now,
                    type: 'Creación de Nuevo Negocio',
                    reason: businessData.observaciones || 'Creado desde detalle de cliente.'
                }],
                cliente: { id: client.id, nombre: client.nombre, cuit: client.cuit }
            };
            return [...negociosState, newBusiness];
        }

        case 'UPDATE_NEGOCIO': {
            const updatedNegocio = action.payload;
            return negociosState.map(n => 
                n.id === updatedNegocio.id 
                    ? { ...updatedNegocio, lastUpdate: now } // <-- Actualiza la fecha aquí
                    : n
            );
        }

        case 'UPDATE_NEGOCIO_STAGE': {
            const updatedNegocio = action.payload;
            return negociosState.map(negocio => {
                if (negocio.id === updatedNegocio.id) {
                    const historyEntry = {
                        date: now,
                        type: `Cambio de estado a: ${updatedNegocio.estado}`,
                        reason: updatedNegocio.motivoUltimoCambio || 'Actualización de estado.'
                    };
                    return {
                        ...updatedNegocio,
                        lastUpdate: now, // <-- Y también aquí
                        history: [...(negocio.history || []), historyEntry]
                    };
                }
                return negocio;
            });
        }

        case 'UPDATE_CLIENT_IN_NEGOCIOS': {
            // ... (el resto del reducer no cambia)
        }

        default:
            return negociosState;
    }
};