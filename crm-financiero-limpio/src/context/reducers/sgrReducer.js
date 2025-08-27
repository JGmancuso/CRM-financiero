// src/context/reducers/sgrReducer.js

export const sgrReducer = (sgrsState, action) => {
    switch (action.type) {
        case 'ADD_SGR': {
            const newSgr = { ...action.payload, id: `sgr-${Date.now()}` };
            return [...sgrsState, newSgr];
        }
        case 'UPDATE_SGR': {
            return sgrsState.map(sgr => sgr.id === action.payload.id ? action.payload : sgr);
        }
        case 'DELETE_SGR': {
            return sgrsState.filter(sgr => sgr.id !== action.payload);
        }
        case 'ADD_SGR_CHECKLIST_ITEM': {
            const { sgrId, type, item } = action.payload;
            return sgrsState.map(sgr => {
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
            return sgrsState.map(sgr => {
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
            return sgrsState.map(sgr => {
                if (sgr.id === sgrId) {
                    const updatedChecklist = { ...sgr.checklist };
                    updatedChecklist[type].splice(index, 1);
                    return { ...sgr, checklist: updatedChecklist };
                }
                return sgr;
            });
        }
        default:
            return sgrsState;
    }
};