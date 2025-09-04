// src/context/reducers/entityReducer.js

export const entityReducer = (entitiesState, action) => {
    switch (action.type) {
        case 'ADD_ENTITY': {
            const newEntity = { ...action.payload, id: `ent-${Date.now()}` };
            return [...entitiesState, newEntity];
        }
        case 'UPDATE_ENTITY': {
            return entitiesState.map(entity => entity.id === action.payload.id ? action.payload : entity);
        }
        case 'DELETE_ENTITY': {
            return entitiesState.filter(entity => entity.id !== action.payload);
        }
        case 'ADD_SGR_CHECKLIST_ITEM': {
            const { sgrId, type, item } = action.payload;
            return entitiesState.map(sgr => {
                if (sgr.id === sgrId) {
                    const updatedChecklist = { ...sgr.checklist };
                    updatedChecklist[type] = [...(updatedChecklist[type] || []), item];
                    return { ...sgr, checklist: updatedChecklist };
                }
                return sgr;
            });
        }
        case 'UPDATE_SGR_CHECKLIST_ITEM': {
            const { sgrId, type, index, text } = action.payload;
            return entitiesState.map(sgr => {
                if (sgr.id === sgrId) {
                    const updatedChecklist = { ...sgr.checklist };
                    updatedChecklist[type][index] = text;
                    return { ...sgr, checklist: updatedChecklist };
                }
                return sgr;
            });
        }
        case 'DELETE_SGR_CHECKLIST_ITEM': {
            const { sgrId, type, index } = action.payload;
            return entitiesState.map(sgr => {
                if (sgr.id === sgrId) {
                    const updatedChecklist = { ...sgr.checklist };
                    updatedChecklist[type].splice(index, 1);
                    return { ...sgr, checklist: updatedChecklist };
                }
                return sgr;
            });
        }
        default:
            return entitiesState;
    }
};