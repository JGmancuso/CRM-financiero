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
        
        // --- LÓGICA DE ACTIVIDADES CORREGIDA Y UNIFICADA ---
        case 'SAVE_ACTIVITY': {
            const { clientId, activityData } = action.payload;
             return clientsState.map(client => {
                if (client.id === clientId) {
                    const newActivity = { 
                        ...activityData, 
                        id: `act-${Date.now()}`,
                        completed: false,
                        isCompleted: false
                    };
                    return { ...client, activities: [...(client.activities || []), newActivity] };
                }
                return client;
            });
        }

        case 'TOGGLE_ACTIVITY': {
            // Recibe el estado objetivo (targetStatus) para ser a prueba de "doble clic"
            const { clientId, activityId, targetStatus } = action.payload;
            const targetId = String(activityId).trim();

            return clientsState.map(client => {
                if (String(client.id).trim() === String(clientId).trim()) {
                    const updatedActivities = (client.activities || []).map(act => {
                        if (String(act.id).trim() === targetId) {
                            // Establece el estado exacto que se le pide
                            const newStatus = targetStatus !== undefined ? targetStatus : !act.completed;
                            return { ...act, completed: newStatus, isCompleted: newStatus };
                        }
                        return act;
                    });
                    return { ...client, activities: updatedActivities };
                }
                return client;
            });
        }

        case 'UPDATE_ACTIVITY': {
            const { clientId, activityData } = action.payload;
            const targetId = String(activityData.id).trim();
            
            return clientsState.map(client => {
                if (client.id === clientId) {
                    const updatedActivities = (client.activities || []).map(act => {
                        if (String(act.id).trim() === targetId) {
                            // 👇 ESTA ES LA CORRECCIÓN CLAVE 👇
                            // Fusionamos la actividad existente con los nuevos datos
                            return { ...act, ...activityData }; 
                        }
                        return act;
                    });
                    return { ...client, activities: updatedActivities };
                }
                return client;
            });
        }

        case 'DELETE_ACTIVITY': {
            const { clientId, activityId } = action.payload;
            const targetId = String(activityId).trim();
            return clientsState.map(client => {
                if (client.id === clientId) {
                    const updatedActivities = (client.activities || []).filter(act => String(act.id).trim() !== targetId);
                    return { ...client, activities: updatedActivities };
                }
                return client;
            });
        }
        
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