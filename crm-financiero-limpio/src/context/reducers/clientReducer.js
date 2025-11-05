// src/context/reducers/clientReducer.js

export const clientReducer = (clientsState, action) => {
    switch (action.type) {
        
        case 'ADD_CLIENT': {
            const newClient = {
                ...action.payload,
                id: `client-${Date.now()}`,
                qualifications: [], activities: [], documents: [], financing: [],
                history: [{ date: new Date().toISOString(), type: 'Creación de Cliente', reason: 'Alta inicial en el sistema.' }]
            };
            return [...clientsState, newClient];
        }

        case 'UPDATE_CLIENT': {
            const updatedClientData = action.payload;
            return clientsState.map(client => {
                if (client.id === updatedClientData.id) {
                    return { ...client, ...updatedClientData };
                }
                return client;
            });
        }
        
        case 'SAVE_ACTIVITY': {
            const { clientId, activityData } = action.payload;
             return clientsState.map(client => {
                if (client.id === clientId) {
                    const newActivity = { ...activityData, id: `act-${Date.now()}` };
                    const updatedActivities = [...(client.activities || []), newActivity];
                    return { ...client, activities: updatedActivities };
                }
                return client;
            });
        }

        // --- 👇 LÓGICA BLINDADA PARA COMPLETAR ---
        case 'TOGGLE_ACTIVITY': {
            // Recibimos targetStatus si está disponible
            const { clientId, activityId, targetStatus } = action.payload;
            const targetId = String(activityId).trim();

            return clientsState.map(client => {
                if (String(client.id).trim() === String(clientId).trim()) {
                    const updatedActivities = (client.activities || []).map(act => {
                        if (String(act.id).trim() === targetId) {
                            // Si nos dieron un targetStatus, lo usamos. Si no, invertimos como antes.
                            // Esto hace que la acción sea "segura" de repetir.
                            const newStatus = targetStatus !== undefined ? targetStatus : !act.completed;
                            console.log(`🎉 [Reducer] Estableciendo actividad ${targetId} a: ${newStatus}`);
                            return { ...act, completed: newStatus, isCompleted: newStatus };
                        }
                        return act;
                    });
                    return { ...client, activities: updatedActivities };
                }
                return client;
            });
        }
        // ----------------------------------------

        case 'UPDATE_ACTIVITY': {
            const { clientId, activityData } = action.payload;
            const targetId = String(activityData.id).trim();
            return clientsState.map(client => {
                if (client.id === clientId) {
                    const updatedActivities = (client.activities || []).map(act => {
                        if (String(act.id).trim() === targetId) {
                            return { ...act, ...activityData };
                        }
                        return act;
                    });
                    return { ...client, activities: updatedActivities };
                }
                return client;
            });
        }

        // --- 👇 LÓGICA BLINDADA PARA ELIMINAR ---
        case 'DELETE_ACTIVITY': {
            const { clientId, activityId } = action.payload;
            const targetId = String(activityId).trim();
            return clientsState.map(client => {
                if (client.id === clientId) {
                    // Filtramos usando la comparación blindada
                    const updatedActivities = (client.activities || []).filter(act => String(act.id).trim() !== targetId);
                    return { ...client, activities: updatedActivities };
                }
                return client;
            });
        }
        // ----------------------------------------
        
        case 'ADD_CLIENT_QUALIFICATION': {
            const { clientId, qualificationData } = action.payload;
            return clientsState.map(client => {
                if (client.id === clientId) {
                    const newQual = { ...qualificationData, id: `qual-manual-${Date.now()}` };
                    return { ...client, qualifications: [...(client.qualifications || []), newQual] };
                }
                return client;
            });
        }

        case 'UPDATE_CLIENT_QUALIFICATION': {
            const { clientId, qualificationData } = action.payload;
            return clientsState.map(client => {
                if (client.id === clientId) {
                    const updatedQuals = (client.qualifications || []).map(q => 
                        q.id === qualificationData.id ? qualificationData : q
                    );
                    return { ...client, qualifications: updatedQuals };
                }
                return client;
            });
        }

        default:
            return clientsState;
    }
};