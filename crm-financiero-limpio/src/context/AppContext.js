// src/context/AppContext.js

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initialData } from '../data'; // Asumiendo que ahora importas un objeto con todo

const APP_DATA_VERSION = '3.0'; // Coincide con la versión de nuestro JSON transformado

// El estado ahora es un objeto que contiene ambas listas
const initialState = {
    clients: [],
    negocios: [],
};

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_STATE': {
            return action.payload;
        }
        case 'ADD_CLIENT_AND_BUSINESS': {
            const newClientData = action.payload;
            const { motivo, montoAproximado, observaciones, ...clientDetails } = newClientData;
            
            // 1. Creamos el nuevo cliente
            const newClient = {
                ...clientDetails,
                id: `client-${Date.now()}`,
                qualifications: [], 
                activities: [], 
                documents: [],
                financing: []
            };

            // 2. Creamos el primer negocio asociado a ese cliente
            const newBusiness = {
                id: `negocio-${newClient.id}`,
                nombre: motivo, // El motivo del contacto es el nombre del primer negocio
                estado: 'PROSPECTO', // Todos los negocios nuevos empiezan como prospectos
                montoSolicitado: parseFloat(montoAproximado) || 0,
                fechaProximoSeguimiento: new Date().toISOString(),
                history: [{
                    date: new Date().toISOString(),
                    type: `Creación de Negocio`,
                    reason: observaciones || 'Creación inicial.'
                }],
                cliente: {
                    id: newClient.id,
                    nombre: newClient.name,
                    cuit: newClient.cuit
                }
            };

            // 3. Devolvemos el nuevo estado con ambas listas actualizadas
            return {
                ...state,
                clients: [...state.clients, newClient],
                negocios: [...state.negocios, newBusiness]
            };
        }
        case 'UPDATE_CLIENT': {
            const updatedClient = action.payload;
            return {
                ...state,
                clients: state.clients.map(c => c.id === updatedClient.id ? updatedClient : c)
            };
        }
        // Aquí irían otras acciones como 'UPDATE_NEGOCIO'
        default: {
            throw Error('Acción desconocida: ' + action.type);
        }
    }
}

const AppStateContext = createContext(null);
const AppDispatchContext = createContext(null);

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState, () => {
        try {
            const savedJSON = localStorage.getItem('crm-data');
            if (savedJSON) {
                const savedObject = JSON.parse(savedJSON);
                if (savedObject.version === APP_DATA_VERSION && savedObject.data) {
                    // Aseguramos que el estado tenga ambas listas, incluso si una falta en el JSON
                    return {
                        clients: savedObject.data.clients || [],
                        negocios: savedObject.data.negocios || [],
                    };
                }
            }
        } catch (error) { console.error("Error al cargar datos:", error); }
        // Carga inicial desde tu archivo de datos transformado
        return {
            clients: initialData.clients || [], // Suponiendo que tu JSON tiene 'clients'
            negocios: initialData.negocios || [] // Y también 'negocios'
        };
    });

    useEffect(() => {
        const dataToSave = { version: APP_DATA_VERSION, data: state };
        localStorage.setItem('crm-data', JSON.stringify(dataToSave));
    }, [state]);

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppStateContext.Provider>
    );
}

// Hooks actualizados
export function useAppState() {
    return useContext(AppStateContext);
}

export function useAppDispatch() {
    return useContext(AppDispatchContext);
}