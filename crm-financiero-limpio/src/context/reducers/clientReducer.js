// src/context/reducers/clientReducer.js

export const clientReducer = (clientsState, action) => {
    switch (action.type) {
        
        case 'ADD_CLIENT': {
            // Lógica de `handleAddClient`
            const newClient = {
                ...action.payload, // payload es clientData
                id: `client-${Date.now()}`,
                qualifications: [], activities: [], documents: [], financing: [],
                history: [{ date: new Date().toISOString(), type: 'Creación de Cliente', reason: 'Alta inicial en el sistema.' }]
            };
            return [...clientsState, newClient];
        }

        case 'UPDATE_CLIENT': {
            // Lógica de `handleUpdateClient` (solo la parte que afecta a clientes)
            const updatedClient = action.payload;
            return clientsState.map(c => c.id === updatedClient.id ? updatedClient : c);
        }

        case 'ADD_DOCUMENT': {
            // Lógica de `handleAddDocument`
            const { clientId, newDocument } = action.payload;
            return clientsState.map(client => {
                if (client.id === clientId) {
                    const updatedDocuments = [...(client.documents || []), { id: `doc-${Date.now()}`, ...newDocument, uploadDate: new Date().toISOString() }];
                    return { ...client, documents: updatedDocuments };
                }
                return client;
            });
        }

        case 'UPDATE_DEBTOR_STATUS': {
            // Lógica de `handleUpdateDebtorStatus`
            const { clientId, newDebtorStatusData } = action.payload;
            return clientsState.map(client => {
                if (client.id === clientId) {
                    return { ...client, debtorStatus: newDebtorStatusData, lastUpdate: new Date().toISOString() };
                }
                return client;
            });
        }
        
        case 'SAVE_ACTIVITY': {
            // Lógica de `handleSaveActivity`
            const { clientId, activityData } = action.payload;
             return clientsState.map(client => {
                if (client.id === clientId) {
                    const existingActivities = client.activities || [];
                    let updatedActivities;

                    if (activityData.id) { // Actualizar
                        updatedActivities = existingActivities.map(act => act.id === activityData.id ? activityData : act);
                    } else { // Añadir
                        const newActivity = { ...activityData, id: `act-${Date.now()}` };
                        updatedActivities = [...existingActivities, newActivity];
                    }
                    return { ...client, activities: updatedActivities };
                }
                return client;
            });
        }

        case 'TOGGLE_ACTIVITY': {
            // Lógica de `handleToggleActivity`
            const { clientId, activityId } = action.payload;
            return clientsState.map(client => {
                if (client.id === clientId) {
                    const updatedActivities = (client.activities || []).map(act => 
                        act.id === activityId ? { ...act, completed: !act.completed } : act
                    );
                    return { ...client, activities: updatedActivities };
                }
                return client;
            });
        }

        default:
            return clientsState;
    }
};
