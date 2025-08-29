export const clientActivitiesReducer = (clientsState, action) => {
    switch (action.type) {
        case 'ADD_ACTIVITY': {
            const { clientId, activityData } = action.payload;
            return clientsState.map(client => {
                if (client.id === clientId) {
                    const newActivity = { 
                        ...activityData, 
                        id: `act-${Date.now()}`,
                        completed: false,
                    };
                    return { ...client, activities: [...(client.activities || []), newActivity] };
                }
                return client;
            });
        }
        
        case 'UPDATE_ACTIVITY': {
            const { clientId, activityData } = action.payload;
            return clientsState.map(client => {
                if (client.id === clientId) {
                    const updatedActivities = (client.activities || []).map(act => 
                        act.id === activityData.id ? activityData : act
                    );
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
                            return { ...act, completed: !act.completed };
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
            return clientsState.map(client => {
                if (client.id === clientId) {
                    const updatedActivities = (client.activities || []).filter(act => act.id !== activityId);
                    return { ...client, activities: updatedActivities };
                }
                return client;
            });
        }

        default:
            return clientsState;
    }
};