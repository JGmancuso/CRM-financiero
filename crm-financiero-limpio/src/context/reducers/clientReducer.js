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
                    // Fusionamos los datos existentes con los nuevos
                    // Esto preserva arrays como 'activities', 'documents', etc.
                    return { ...client, ...updatedClientData };
                }
                return client;
            });
        }
        
        
        // --- LÓGICA CLAVE PARA ACTIVIDADES ---
        case 'SAVE_ACTIVITY': {
            const { clientId, activityData } = action.payload;
             return clientsState.map(client => {
                if (client.id === clientId) {
                    const newActivity = { 
                        ...activityData, 
                        // El ID ahora se crea con el prefijo 'act-'
                        id: `act-${Date.now()}` 
                    };
                    const updatedActivities = [...(client.activities || []), newActivity];
                    return { ...client, activities: updatedActivities };
                }
                return client;
            });
        }

        case 'TOGGLE_ACTIVITY': {
            const { clientId, activityId } = action.payload;
            return clientsState.map(client => {
                if (client.id === clientId) {
                    const updatedActivities = (client.activities || []).map(act => {
                        if (act.id === activityId) {
                            return { ...act, completed: !act.completed, isCompleted: !act.completed };
                        }
                        return act;
                    });
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
        // --- FIN DE LA LÓGICA CLAVE ---

        default:
            return clientsState;
    }
};