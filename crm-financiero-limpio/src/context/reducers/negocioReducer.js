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
                montoSolicitado: businessData.montoSolicitado,
                fechaProximoSeguimiento: now,
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

        case 'UPDATE_NEGOCIO_STAGE': {
            const updatedNegocio = action.payload;
            
            return negociosState.map(negocio => {
                if (negocio.id === updatedNegocio.id) {
                    let historyEntry;
                    
                    // LÓGICA CLAVE: Comprueba si el estado realmente cambió
                    if (negocio.estado !== updatedNegocio.estado) {
                        // Si el estado CAMBIÓ, se registra como "Cambio de estado"
                        historyEntry = {
                            date: now,
                            type: `Cambio de estado a: ${updatedNegocio.estado}`,
                            reason: updatedNegocio.motivoUltimoCambio || 'Actualización de estado.'
                        };
                    } else {
                        // Si NO cambió, se registra como una simple "Modificación de Detalles"
                        historyEntry = {
                            date: now,
                            type: 'Modificación de Detalles',
                            reason: updatedNegocio.motivoUltimoCambio || 'Se actualizaron los datos del negocio.'
                        };
                    }
                    return {
                        ...updatedNegocio,
                        lastUpdate: now,
                        history: [...(negocio.history || []), historyEntry]
                    };
                }
                return negocio;
            });
        }
        
        case 'UPDATE_NEGOCIO': {
            const updatedNegocio = action.payload;
            return negociosState.map(n => 
                n.id === updatedNegocio.id 
                    ? { ...updatedNegocio, lastUpdate: now }
                    : n
            );
        }
        
        case 'UPDATE_CLIENT_IN_NEGOCIOS': {
            const updatedClient = action.payload;
            return negociosState.map(n => {
                if (n.cliente.id === updatedClient.id) {
                    return { ...n, cliente: { ...n.cliente, nombre: updatedClient.name, cuit: updatedClient.cuit }};
                }
                return n;
            });
        }
        // --- 👇 LÓGICA AÑADIDA AQUÍ 👇 ---
        case 'UPDATE_NEGOCIO_CALIFICACIONES': {
            const updatedNegocio = action.payload;
            return negociosState.map(negocio => 
                negocio.id === updatedNegocio.id 
                    ? { ...negocio, calificaciones: updatedNegocio.calificaciones, lastUpdate: new Date().toISOString() }
                    : negocio
            );
        }
        // --- 👆 FIN DE LA LÓGICA AÑADIDA 👆 ---
        default:
            return negociosState;
    }
};