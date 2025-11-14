// src/context/reducers/campaignReducer.js

export const campaignReducer = (campaignsState, action) => {
    switch (action.type) {
        
        case 'ADD_CAMPAIGN':
            // Añade la nueva campaña (que viene en action.payload)
            return [...campaignsState, action.payload];
        
        case 'DELETE_CAMPAIGN':
            // Filtra y elimina la campaña por su ID (que viene en action.payload)
            return campaignsState.filter(c => c.id !== action.payload);
        
        case 'UPDATE_CAMPAIGN':
            // Reemplaza la campaña antigua por la nueva versión actualizada
            return campaignsState.map(c => 
                c.id === action.payload.id ? action.payload : c
            );

        default:
            return campaignsState;
    }
    // --- 👇 El error estaba aquí (un '>' extra) ---
};

