// src/context/reducers/clientReducer.js

export const clientReducer = (clientsState, action) => {
    switch (action.type) {
        
        case 'ADD_CLIENT': {
            // ... (código sin cambios)
        }

        case 'UPDATE_CLIENT': {
            // ... (código sin cambios)
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
        // --- FIN DE LA LÓGICA CLAVE ---

        default:
            return clientsState;
    }
};