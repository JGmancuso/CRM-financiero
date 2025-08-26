// src/context/reducers/negocioReducer.js

export const negocioReducer = (negociosState, action) => {
    switch (action.type) {
        
        case 'ADD_NEW_BUSINESS': {
            // Lógica de `handleAddNewBusiness`
            const { client, businessData } = action.payload;
            const newBusiness = {
                id: `negocio-${client.id}-${Date.now()}`,
                nombre: businessData.motivo,
                estado: 'PROSPECTO',
                montoSolicitado: businessData.montoAproximado,
                fechaProximoSeguimiento: new Date().toISOString(),
                history: [{
                    date: new Date().toISOString(),
                    type: 'Creación de Nuevo Negocio',
                    reason: businessData.observaciones || 'Creado desde detalle de cliente.'
                }],
                cliente: { id: client.id, nombre: client.nombre, cuit: client.cuit }
            };
            return [...negociosState, newBusiness];
        }

        case 'UPDATE_NEGOCIO': {
            // Este caso es para una actualización general sin lógica de historial
            const updatedNegocio = action.payload;
            return negociosState.map(n => n.id === updatedNegocio.id ? updatedNegocio : n);
        }

        // --- 👇 LÓGICA AÑADIDA AQUÍ 👇 ---
        case 'UPDATE_NEGOCIO_STAGE': {
            const updatedNegocio = action.payload;
            
            return negociosState.map(negocio => {
                if (negocio.id === updatedNegocio.id) {
                    // Prepara una nueva entrada para el historial
                    const historyEntry = {
                        date: new Date().toISOString(),
                        type: `Cambio de estado a: ${updatedNegocio.estado}`,
                        reason: updatedNegocio.motivoUltimoCambio || 'Actualización de estado desde el embudo.'
                    };

                    // Devuelve el negocio actualizado con la nueva entrada en el historial
                    return {
                        ...updatedNegocio,
                        history: [...(negocio.history || []), historyEntry]
                    };
                }
                return negocio;
            });
        }
        // --- 👆 FIN DE LA LÓGICA AÑADIDA ---

        case 'UPDATE_CLIENT_IN_NEGOCIOS': {
            const updatedClient = action.payload;
            return negociosState.map(n => {
                if (n.cliente.id === updatedClient.id) {
                    return { ...n, cliente: { ...n.cliente, nombre: updatedClient.name, cuit: updatedClient.cuit }};
                }
                return n;
            });
        }

        default:
            return negociosState;
    }
};