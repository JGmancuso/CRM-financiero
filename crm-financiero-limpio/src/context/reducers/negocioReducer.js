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
             // Lógica de `handleUpdateNegocio` y `handleNegocioStageChange` (solo la parte que afecta a negocios)
            const updatedNegocio = action.payload;
            return negociosState.map(n => n.id === updatedNegocio.id ? updatedNegocio : n);
        }

        // Caso para cuando un cliente se actualiza y necesitamos reflejar el cambio aquí
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